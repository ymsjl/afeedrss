// HTTP 错误状态码常量

export const HTTP_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
// 自定义 HTTP 错误类型

export class HttpError extends Error {
  status: number;
  statusText: string;
  responseText: string;
  isHttpError: boolean;
  needsAuthentication: boolean;

  constructor(status: number, statusText: string, responseText: string) {
    // 为不同状态码定制错误信息
    let message: string;
    switch (status) {
      case HTTP_ERROR_CODES.UNAUTHORIZED:
        message = "未授权，请重新登录";
        break;
      case HTTP_ERROR_CODES.FORBIDDEN:
        message = "无访问权限，请重新登录";
        break;
      case HTTP_ERROR_CODES.NOT_FOUND:
        message = "请求的资源不存在";
        break;
      case HTTP_ERROR_CODES.SERVER_ERROR:
        message = "服务器错误，请稍后再试";
        break;
      default:
        message = `请求失败 (${status}): ${statusText}`;
    }

    super(message);
    this.status = status;
    this.statusText = statusText;
    this.responseText = responseText;
    this.isHttpError = true;
    // 401 和 403 错误需要重新认证
    this.needsAuthentication = status === HTTP_ERROR_CODES.UNAUTHORIZED || status === HTTP_ERROR_CODES.FORBIDDEN;

    // 确保 instanceof 能够正常工作
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
