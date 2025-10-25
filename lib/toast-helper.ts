import { toast } from "sonner";

/**
 * 显示错误提示
 *
 * @param message - 错误消息
 * @param description - 可选的详细描述
 * @param duration - 可选的持续时间
 *
 * @example
 * showError("文件类型错误");
 * showError("文件格式错误", `检测到的类型为：${file.type}`);
 */
export function showError(message: string, description?: string, duration?: number) {
  toast.error(message, {
    description,
    duration,
  });
}

/**
 * 显示成功提示
 *
 * @param message - 成功消息
 * @param description - 可选的详细描述
 * @param duration - 可选的持续时间
 *
 * @example
 * showSuccess("文件解析成功");
 * showSuccess("解析成功", `共解析 ${count} 条数据`);
 */
export function showSuccess(message: string, description?: string, duration?: number) {
  toast.success(message, {
    description,
    duration,
  });
}

/**
 * 显示警告提示
 *
 * @param message - 警告消息
 * @param description - 可选的详细描述
 * @param duration - 可选的持续时间
 *
 * @example
 * showWarning("文件类型错误");
 * showWarning("文件格式错误", `检测到的类型为：${file.type}`);
 */
export function showWarning(message: string, description?: string, duration?: number) {
  toast.warning(message, {
    description,
    duration,
  });
}

/**
 * 显示信息提示
 *
 * @param message - 信息消息
 * @param description - 可选的详细描述
 * @param duration - 可选的持续时间
 *
 * @example
 * showInfo("文件解析成功");
 * showInfo("解析成功", `共解析 ${count} 条数据`);
 */
export function showInfo(message: string, description?: string, duration?: number) {
  toast.info(message, {
    description,
    duration,
  });
}

/**
 * 显示加载提示
 *
 * @param message - 加载消息
 * @param duration - 可选的持续时间
 * @returns toast ID，用于后续关闭
 *
 * @example
 * const loading = showLoading("正在解析Excel文件...");
 * // 完成后
 * hideToast(loading);
 */
export function showLoading(message: string, duration?: number): string | number {
  return toast.loading(message, {
    duration,
  });
}

/**
 * 关闭指定的提示
 *
 * @param toastId - toast ID
 *
 * @example
 * hideToast(loading);
 */
export function hideToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * 关闭所有提示
 *
 * @example
 * hideAllToasts();
 */
export function hideAllToasts() {
  toast.dismiss();
}
