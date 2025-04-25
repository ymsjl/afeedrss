"use client";

import React, { useEffect, useRef, useState } from "react";
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

  // 处理打开和关闭的动画效果
  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
      // 添加一个小延迟，确保DOM已经更新
      setTimeout(() => {
        setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');
        setTranslateY(0);
      }, 10);
    } else if (!isOpen && isVisible) {
      setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');
      setTranslateY(window.innerHeight);
      // 动画结束后，隐藏元素
      setTimeout(() => {
        setIsVisible(false);
        setTranslateY(0);
        setTransition(undefined);
      }, 250);
    }
  }, [isOpen, isVisible]);

  // 处理触摸开始事件
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    lastTranslateY.current = translateY;
    setTransition(undefined);
  };

  // 处理触摸移动事件
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY < 0) return; // 只允许向下拖动
    
    setTranslateY(deltaY);
  };

  // 处理触摸结束事件
  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    
    const deltaY = translateY;
    const time = Date.now() - touchStartTime.current;
    const velocity = deltaY / (time || 1); // px/ms
    
    // 如果移动距离大于模态窗高度的20%或速度超过0.6px/ms，则关闭模态窗
    const modalHeight = modalRef.current?.offsetHeight || 300;
    const shouldClose = deltaY > modalHeight * 0.2 || velocity > 0.6;
    
    setTransition('transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)');
    
    if (shouldClose) {
      setTranslateY(window.innerHeight);
      setTimeout(() => {
        onClose();
      }, 250);
    } else {
      setTranslateY(0);
    }
    
    touchStartY.current = null;
  };

  // 处理点击遮罩关闭
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // 如果不可见并且关闭状态，则不需要渲染
  if (!isVisible && !isOpen) {
    return null;
  }

  const modalStyle = {
    transform: `translateY(${translateY}px)`,
    transition: transition,
  };

  return (
    <div
      className={classes.overlay}
      onClick={handleOverlayClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.25s ease"
      }}
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
          commonClasses.scrollY
        )}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HalfScreenModal;