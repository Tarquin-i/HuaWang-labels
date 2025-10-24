"use client";

import { CircleCheckIcon, OctagonXIcon, FileTextIcon } from "lucide-react";

interface LabelPreviewProps {
  fontSize: string;
  spareQuantity: string;
  chineseLabel: boolean;
  englishLabel: boolean;
  silverLabel: boolean;
  status: "idle" | "success" | "error";
  errorMessage?: string;
}

export function LabelPreview({
  fontSize,
  spareQuantity,
  chineseLabel,
  englishLabel,
  silverLabel,
  status,
  errorMessage = "失败原因",
}: LabelPreviewProps) {
  const selectedStyles = [chineseLabel, englishLabel, silverLabel].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-4 flex flex-col w-full lg:flex-55">
      {/* PDF预览容器 */}
      <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">标签预览</h3>

        {/* PDF预览占位区 */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <FileTextIcon className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <p className="text-base font-medium text-muted-foreground">
                PDF 样板预览
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                实时显示标签样式
              </p>
            </div>
            {/* 显示当前配置信息 */}
            <div className="text-xs text-muted-foreground space-y-1 pt-4">
              <p>字体大小: {fontSize}</p>
              <p>备品数量: {spareQuantity}</p>
              <p>选中款式: {selectedStyles} 种</p>
              <div className="pt-2 space-y-1">
                {chineseLabel && <p>✓ 中文吊牌</p>}
                {englishLabel && <p>✓ 英文吊牌</p>}
                {silverLabel && <p>✓ 烫银吊牌</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 成功/失败状态 */}
      {status === "success" && (
        <div className="border rounded-lg p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-700">
            <CircleCheckIcon className="w-5 h-5" />
            <h4 className="font-medium">生成成功</h4>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="border rounded-lg p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700 mb-2">
            <OctagonXIcon className="w-5 h-5" />
            <h4 className="font-medium">生成失败</h4>
          </div>
          <p className="text-sm text-red-600 ml-8">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
