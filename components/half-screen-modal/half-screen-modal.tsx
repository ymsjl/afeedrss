"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useHalfScreenModalStyles } from "./half-screen-modal.style";

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
  const [isVisible, setIsVisible] = useState(false);
  // 移除 translateY 和 transition 状态，使用 ref 替代
  const currentTranslateY = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isScrollingElement = useRef<boolean>(false);
  const scrollParentScrollTop = useRef<number | null>(null);
  const scrollableParentRef = useRef<HTMLElement | null>(null);
  const maskRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const originalBodyOverflow = useRef<string>('');
  const originalBodyPosition = useRef<string>('');
  const originalBodyTop = useRef<string>('');
  const originalBodyWidth = useRef<string>('');
  const scrollY = useRef<number>(0);

  // 禁用页面滚动
  const disablePageScroll = useCallback(() => {
    // 保存当前body样式值
    if (typeof window !== 'undefined') {
      const { style } = document.body;
      originalBodyOverflow.current = style.overflow;
      originalBodyPosition.current = style.position;
      originalBodyTop.current = style.top;
      originalBodyWidth.current = style.width;

      // 保存当前滚动位置
      scrollY.current = window.scrollY;

      // 设置body样式，阻止滚动
      style.overflow = 'hidden';
      style.position = 'fixed';
      style.top = `-${scrollY.current}px`;
      style.width = '100%';
    }
  }, []);

  // 恢复页面滚动
  const enablePageScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      // 恢复原来的样式
      const { style } = document.body;
      style.overflow = originalBodyOverflow.current;
      style.position = originalBodyPosition.current;
      style.top = originalBodyTop.current;
      style.width = originalBodyWidth.current;

      // 恢复滚动位置
      window.scrollTo(0, scrollY.current);
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

  // 直接设置元素的 transform 和 transition 样式
  const setModalTransform = useCallback((y: number, withTransition = false) => {
    if (!modalRef.current) return;

    currentTranslateY.current = y;

    if (withTransition) {
      modalRef.current.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      modalRef.current.style.transition = '';
    }

    modalRef.current.style.transform = `translate3d(0px, ${y}px, 0px)`;
  }, []);

  // 使用 useEffect 处理打开和关闭的动画效果
  useEffect(() => {
    if (isOpen && !isVisible) {
      // 禁用页面滚动
      disablePageScroll();

      setIsVisible(true);
      // 使用 requestAnimationFrame 而不是 setTimeout 更加平滑
      requestAnimationFrame(() => {
        setModalTransform(0, true);
      });
    } else if (!isOpen && isVisible) {
      enablePageScroll();
      setIsVisible(false);
    }
  }, [isOpen, isVisible, setModalTransform, disablePageScroll, enablePageScroll]);

  // 组件卸载时确保恢复页面滚动
  useEffect(() => {
    return () => {
      if (isOpen) {
        enablePageScroll();
      }
    };
  }, [isOpen, enablePageScroll]);

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
    if (isScrollingElement.current) {
      scrollParentScrollTop.current = scrollableParentRef.current?.scrollTop ?? 0;
    }
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();


    // 直接移除过渡效果
    if (modalRef.current) {
      modalRef.current.style.transition = '';
    }
  }, [findScrollableParent]);

  // 处理触摸移动事件，使用 requestAnimationFrame 优化
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    // 使用节流函数减少触发频率
    const currentY = e.touches[0].clientY;
    let deltaY = currentY - touchStartY.current!;
    const isScrollingDown = deltaY > 0;

    // 如果是在可滚动元素上滑动
    if (isScrollingElement.current && scrollableParentRef.current) {
      // 只有当滚动到顶部并且向下滑动时，才处理模态框的拖动
      const canHandleModalDrag = isScrollingDown && isAtScrollBoundary(scrollableParentRef.current, 'up');

      if (!canHandleModalDrag) {
        return; // 不处理模态框的拖动
      } else {
        deltaY -= scrollParentScrollTop.current ?? 0;
      }
    }

    // 只允许向下拖动
    if (deltaY < 0) return;

    // 使用 requestAnimationFrame 进行平滑渲染
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }

    animationFrameId.current = requestAnimationFrame(() => {
      // 直接设置 transform 样式
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0px, ${deltaY}px, 0px)`;

        currentTranslateY.current = deltaY;
      }
      if (maskRef.current) {
        maskRef.current.style.opacity = `${1 - deltaY / window.innerHeight}`;
      }
      animationFrameId.current = null;
    });
  }, [isAtScrollBoundary]);

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
      const deltaY = currentTranslateY.current;
      scrollParentScrollTop.current = 0;
      // 只有当拖动距离大于0时才可能关闭
      if (deltaY <= 0) {
        touchStartY.current = null;
        return;
      }
    }

    const deltaY = currentTranslateY.current;
    const time = Date.now() - touchStartTime.current;
    const velocity = deltaY / (time || 1); // px/ms

    // 如果移动距离大于模态窗高度的20%或速度超过0.6px/ms，则关闭模态窗
    const modalHeight = modalRef.current?.offsetHeight || 300;
    const shouldClose = deltaY > modalHeight * 0.2 || velocity > 0.6;

    if (modalRef.current) {
      modalRef.current.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    if (shouldClose) {
      // 直接设置 transform 样式
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0px, ${window.innerHeight}px, 0px)`;
        currentTranslateY.current = window.innerHeight;
      }

      if (maskRef.current) {
        maskRef.current.style.opacity = '0';
      }

      const timer = setTimeout(() => {
        onClose();
      }, 250);
    } else {
      // 回到初始位置
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0px, 0px, 0px)`;
        currentTranslateY.current = 0;
      }
      if (maskRef.current) {
        maskRef.current.style.opacity = '1';
      }
    }

    touchStartY.current = null;
    scrollableParentRef.current = null;
  }, [onClose]);

  // 处理点击遮罩关闭
  const handleMaskClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  // 如果不可见并且关闭状态，则不需要渲染
  if (!isVisible && !isOpen) {
    return null;
  }

  return (
    <div className={classes.overlay}>
      <div className={classes.mask} ref={maskRef} onClick={handleMaskClick}></div>
      <div
        ref={modalRef}
        className={mergeClasses(
          classes.modal,
          classes[size],
          className
        )}
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