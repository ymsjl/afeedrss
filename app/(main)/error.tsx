"use client";
import { usePageLayoutClasses } from "@/styles/usePageLayouClasses";
import { useFlexClasses } from "@/theme/commonStyles";
import {
  Button,
  makeStyles,
  Text,
  tokens,
  Spinner,
  Caption1,
  mergeClasses
} from "@fluentui/react-components";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@/server/fetch";
import { useAppStore } from "../providers/AppStoreProvider";

// 错误图片映射
const ERROR_IMAGES = {
  auth: "/images/3d-fluency-bandage.png",
  notFound: "/images/flag-in-hole.png",
  serverError: "/images/3d-fluency-spiderweb.png",
  default: "/images/3d-fluency-bandage.png"
};

export default function Error({
  error,
  reset,
}: {
  error: Error & Partial<HttpError>;
  reset: () => void;
}) {
  const router = useRouter();
  const classes = useClasses();
  const pageLayoutClasses = usePageLayoutClasses();
  const flexClasses = useFlexClasses();
  const setSession = useAppStore(store => store.setSession)
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 检查是否为 HTTP 错误，特别是认证错误
  const isHttpError = error.isHttpError;
  const isAuthError = error.needsAuthentication;
  const statusCode = error.status;

  // 根据错误类型选择图片
  const getErrorImage = () => {
    if (!isHttpError) return ERROR_IMAGES.default;

    if (isAuthError) return ERROR_IMAGES.auth;
    if (statusCode === 404) return ERROR_IMAGES.notFound;
    if (statusCode && statusCode >= 500) return ERROR_IMAGES.serverError;

    return ERROR_IMAGES.default;
  };

  // 处理认证错误，自动跳转到登录页
  useEffect(() => {
    if (isAuthError) {
      // setSession(null)
    }
  }, [isAuthError, router, setSession]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    reset();
  };

  const handleLogin = () => {
    router.push("/auth/signin");
  };

  return (
    <div className={pageLayoutClasses.main}>
      <div className={mergeClasses(pageLayoutClasses.content, flexClasses.flexCol, flexClasses.flexCenter, classes.errorContainer)}>
        <Image
          src={getErrorImage()}
          alt="Error illustration"
          width={200}
          height={200}
          priority
        />

        <Text className={classes.errorTitle}>
          {isAuthError ? "需要登录" : "糟糕，出错了！"}
        </Text>

        <Caption1 className={classes.errorMessage}>
          {error.message || "页面加载出现问题，请尝试刷新页面"}
          {isAuthError && <div className={classes.authNote}>页面将在几秒后自动跳转到登录页...</div>}
        </Caption1>

        {isAuthError ? (
          <Button
            className={classes.retryButton}
            appearance="primary"
            onClick={handleLogin}
          >
            立即登录
          </Button>
        ) : (
          <Button
            className={classes.retryButton}
            appearance="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? <Spinner size="tiny" /> : "刷新页面"}
          </Button>
        )}

        {process.env.NODE_ENV !== "production" && error.stack && (
          <pre className={classes.errorStack}>
            {error.stack}
            {isHttpError && (
              <>
                <hr />
                <div>HTTP 状态码: {statusCode}</div>
                <div>状态信息: {error.statusText}</div>
                {error.responseText && (
                  <div>
                    <div>响应内容:</div>
                    <div>{error.responseText}</div>
                  </div>
                )}
              </>
            )}
          </pre>
        )}
      </div>
    </div>
  );
}

const useClasses = makeStyles({
  errorContainer: {
    flexGrow: 1,
    gap: tokens.spacingVerticalM,
  },
  errorTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorPaletteRedForeground1,
    marginBottom: tokens.spacingVerticalS,
  },
  errorMessage: {
    color: tokens.colorNeutralForeground1,
    maxWidth: "400px",
    textAlign: "center",
  },
  authNote: {
    marginTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  retryButton: {
    minWidth: "120px",
  },
  errorStack: {
    padding: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    width: "100%",
    maxHeight: "300px",
    overflowY: "auto",
    textAlign: "left",
  },
});
