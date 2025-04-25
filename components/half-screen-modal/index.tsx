"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useHalfScreenModalStyles } from "./half-screen-modal.style";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";

export type HalfScreenModalSize = "small" | "medium" | "large";

export interface HalfScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: HalfScreenModalSize;
  className?: string;
  contentClassName?: string;
  closeOnOverlayClick?: boolean;
}

export const HalfScreenModal: React.FC<HalfScreenModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  className,
  contentClassName,
  closeOnOverlayClick = true,
}) => {
  const classes = useHalfScreenModalStyles();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();

  const [isVisible, setIsVisible] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [transition, setTransition] = useState<string | undefined>(undefined);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const lastTranslateY = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const isScrollingElement = useRef<boolean>(false);
  const scrollableParentRef = useRef<HTMLElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTouchMoveTime = useRef<number>(0);

  // 节流函数用于优化频繁触发的事件
  const throttle = useCallback((callback: Function, delay: number = 16) => {
    const now = Date.now();
    if (now - lastTouchMoveTime.current >= delay) {
      callback();
      lastTouchMoveTime.current = now;
    }
  }, []);

  // 使用 useCallback 优化不必要的函数重建
  // 检查元素是否可滚动，使用缓存减少计算
  const isScrollable = useCallback((element: HTMLElement): boolean => {
    // 检查元素是否有滚动条
    const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
    if (!hasVerticalScrollbar) return false;

    // 检查元素是否可以滚动
    const canScrollUp = element.scrollTop > 0;
    const canScrollDown = element.scrollTop + element.clientHeight < element.scrollHeight;

    return canScrollUp || canScrollDown;
  }, []);

  // 查找触摸事件发生时的可滚动父元素，使用缓存
  const findScrollableParent = useCallback((target: HTMLElement | null): HTMLElement | null => {
    if (!target || target === modalRef.current) return null;

    if (isScrollable(target)) {
      return target;
    }

    return findScrollableParent(target.parentElement);
  }, [isScrollable]);

  // 检查滚动元素是否已经到达边界，优化计算
  const isAtScrollBoundary = useCallback((element: HTMLElement, direction: 'up' | 'down'): boolean => {
    if (!element) return true;

    if (direction === 'up') {
      // 检查是否已经滚动到顶部
      return element.scrollTop <= 0;
    } else {
      // 检查是否已经滚动到底部
      const scrollBottom = Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      );
      // 使用一个小的容差值来允许舍入误差
      return scrollBottom < 1;
    }
  }, []);

  // 使用 useEffect 处理打开和关闭的动画效果
  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
      // 使用 requestAnimationFrame 而不是 setTimeout 更加平滑
      requestAnimationFrame(() => {
        setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');
        setTranslateY(0);
      });
    } else if (!isOpen && isVisible) {
      setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');
      setTranslateY(window.innerHeight);
      // 使用 transitionend 事件或 setTimeout 处理动画结束
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTranslateY(0);
        setTransition(undefined);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  // 清除可能的 animationFrame
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, []);

  // 处理触摸开始事件
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 清除之前可能存在的 animationFrame
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    // 检查触摸是否发生在可滚动元素上
    const target = e.target as HTMLElement;
    scrollableParentRef.current = findScrollableParent(target);
    isScrollingElement.current = scrollableParentRef.current !== null;

    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    lastTranslateY.current = translateY;
    setTransition(undefined);
  }, [findScrollableParent, translateY]);

  // 处理触摸移动事件，使用 requestAnimationFrame 优化
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    // 使用节流函数减少触发频率
    throttle(() => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current!;
      const isScrollingDown = deltaY > 0;

      // 如果是在可滚动元素上滑动
      if (isScrollingElement.current && scrollableParentRef.current) {
        // 只有当滚动到顶部并且向下滑动时，才处理模态框的拖动
        const canHandleModalDrag = isScrollingDown &&
          isAtScrollBoundary(scrollableParentRef.current, 'up');

        if (!canHandleModalDrag) {
          return; // 不处理模态框的拖动
        }
      }

      // 只允许向下拖动
      if (deltaY < 0) return;

      // 使用 requestAnimationFrame 进行平滑渲染
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }

      animationFrameId.current = requestAnimationFrame(() => {
        setTranslateY(deltaY);
        animationFrameId.current = null;
      });
    });
  }, [throttle, isAtScrollBoundary]);

  // 处理触摸结束事件
  const handleTouchEnd = useCallback(() => {
    // 清除可能存在的 animationFrame
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    if (touchStartY.current === null) return;

    // 如果是在可滚动元素上滑动结束，不处理关闭逻辑
    if (isScrollingElement.current) {
      const deltaY = translateY;
      // 只有当拖动距离大于0时才可能关闭
      if (deltaY <= 0) {
        touchStartY.current = null;
        return;
      }
    }

    const deltaY = translateY;
    const time = Date.now() - touchStartTime.current;
    const velocity = deltaY / (time || 1); // px/ms

    // 如果移动距离大于模态窗高度的20%或速度超过0.6px/ms，则关闭模态窗
    const modalHeight = modalRef.current?.offsetHeight || 300;
    const shouldClose = deltaY > modalHeight * 0.2 || velocity > 0.6;

    setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');

    if (shouldClose) {
      setTranslateY(window.innerHeight);
      const timer = setTimeout(() => {
        onClose();
      }, 250);
    } else {
      setTranslateY(0);
    }

    touchStartY.current = null;
    scrollableParentRef.current = null;
  }, [translateY, onClose]);

  // 处理点击遮罩关闭
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);


  // 使用 useMemo 减少重复计算样式
  const modalStyle = useMemo(() => ({
    transform: `translateY(${translateY}px)`,
    transition: transition,
  }), [translateY, transition]);

  const overlayStyle = useMemo(() => ({
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.25s ease",
  }), [isVisible]);


  // 如果不可见并且关闭状态，则不需要渲染
  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div
      className={classes.overlay}
      onClick={handleOverlayClick}
      style={overlayStyle}
    >
      <div
        ref={modalRef}
        className={mergeClasses(
          classes.modal,
          classes[size],
          className
        )}
        style={modalStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={classes.handle} />
        <div className={mergeClasses(
          classes.content,
          contentClassName,
        )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HalfScreenModal;