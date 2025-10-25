"use client";

import { CircleCheckIcon, OctagonXIcon } from "lucide-react";
import { LabelCanvas, type LabelStyle } from "./label-canvas";
import { Product } from "@/lib/mock-data";

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

  return (
    <div className="space-y-4 flex flex-col w-full lg:flex-55">
      {/* PDF预览容器 */}
      <div className="bg-card border rounded-lg p-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">标签预览</h3>
        </div>

        {/* Canvas预览区 - 固定高度，内部可滚动 */}
        <div className="bg-muted/30 rounded-lg overflow-y-auto h-[700px]">
          {previewProduct ? (
            <div className="p-4 space-y-4">
              {enabledStyles.map((styleType) => (
                <div key={styleType} className="flex flex-col items-center">
                  <LabelCanvas
                    product={previewProduct}
                    style={styleType}
                    fontSize={parseInt(fontSize, 10) || 20}
                    width={800}
                    height={600}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <p className="text-base font-medium text-muted-foreground">
                  暂无预览
                </p>
                <p className="text-xs text-muted-foreground">
                  请选择产品以查看标签预览
                </p>
              </div>
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
