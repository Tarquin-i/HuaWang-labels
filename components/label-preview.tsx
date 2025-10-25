"use client";

import { CircleCheckIcon, OctagonXIcon } from "lucide-react";
import { LabelCanvas, type LabelStyle } from "./label-canvas";
import { Product } from "@/lib/mock-data";
import { useState } from "react";
import { Button } from "./ui/button";

interface LabelPreviewProps {
  fontSize: string;
  spareQuantity: string;
  chineseLabel: boolean;
  englishLabel: boolean;
  silverLabel: boolean;
  status: "idle" | "success" | "error";
  errorMessage?: string;
  previewProduct?: Product;
}

export function LabelPreview({
  fontSize,
  spareQuantity,
  chineseLabel,
  englishLabel,
  silverLabel,
  status,
  errorMessage = "失败原因",
  previewProduct,
}: LabelPreviewProps) {
  const selectedStyles = [chineseLabel, englishLabel, silverLabel].filter(
    Boolean
  ).length;

  // Determine which styles are enabled
  const enabledStyles: LabelStyle[] = [];
  if (chineseLabel) enabledStyles.push("chinese");
  if (englishLabel) enabledStyles.push("english");
  if (silverLabel) enabledStyles.push("silver");

  // Current preview style (cycle through enabled styles)
  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);
  const currentStyle = enabledStyles[currentStyleIndex] || "chinese";

  const cycleStyle = () => {
    setCurrentStyleIndex((prev) => (prev + 1) % enabledStyles.length);
  };

  const getStyleLabel = (style: LabelStyle) => {
    switch (style) {
      case "chinese":
        return "中文吊牌";
      case "english":
        return "英文吊牌";
      case "silver":
        return "烫银吊牌";
    }
  };

  return (
    <div className="space-y-4 flex flex-col w-full lg:flex-55">
      {/* PDF预览容器 */}
      <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">标签预览</h3>
          {previewProduct && enabledStyles.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={cycleStyle}
            >
              切换样式: {getStyleLabel(currentStyle)}
            </Button>
          )}
        </div>

        {/* Canvas预览区 */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg p-4 overflow-auto">
          {previewProduct ? (
            <div className="flex flex-col items-center gap-4">
              <LabelCanvas
                product={previewProduct}
                style={currentStyle}
                fontSize={parseInt(fontSize) || 20}
                width={800}
                height={600}
              />
              <div className="text-sm text-muted-foreground space-y-1 text-center">
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
          ) : (
            <div className="text-center space-y-4">
              <p className="text-base font-medium text-muted-foreground">
                暂无预览
              </p>
              <p className="text-xs text-muted-foreground">
                请选择产品以查看标签预览
              </p>
            </div>
          )}
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
