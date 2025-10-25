"use client";

import { CircleCheckIcon, OctagonXIcon } from "lucide-react";
import { LabelCanvas, type LabelStyle, calculateOptimalFontSize } from "./label-canvas";
import { Product } from "@/lib/mock-data";
import { useProducts } from "@/lib/product-context";

// 追加到产品名称的样式后缀（与 label-canvas.tsx 中相同）
const STYLE_SUFFIX: Record<LabelStyle, string> = {
  chinese: "-中文吊牌",
  english: "-英文吊牌",
  silver: "-烫银吊牌",
};

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

// 根据5000规则将产品拆分成多个块
function splitProductQuantity(product: Product, spareQuantity: number): {
  regularChunks: number[];
  spareQuantity: number;
} {
  const regularChunks: number[] = [];
  const quantity = product.quantity;

  // 拆分常规标签
  if (quantity > 5000) {
    const chunks = Math.floor(quantity / 5000);
    const remainder = quantity % 5000;

    // 完整的5000块
    for (let i = 0; i < chunks; i++) {
      regularChunks.push(5000);
    }

    // 余数块
    if (remainder > 0) {
      regularChunks.push(remainder);
    }
  } else {
    // 数量 <= 5000 的单个标签
    regularChunks.push(quantity);
  }

  return {
    regularChunks,
    spareQuantity
  };
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
  const { selectedProducts } = useProducts();

  // 确定启用了哪些样式
  const enabledStyles: LabelStyle[] = [];
  if (chineseLabel) enabledStyles.push("chinese");
  if (englishLabel) enabledStyles.push("english");
  if (silverLabel) enabledStyles.push("silver");

  // 使用所有选中的产品，而不仅仅是预览产品
  const productsToDisplay = selectedProducts.length > 0 ? selectedProducts : (previewProduct ? [previewProduct] : []);

  // 解析备品数量 - 允许 0 或 NaN（将在标签中显示为空）
  const spareQty = parseInt(spareQuantity, 10);

  return (
    <div className="space-y-4 flex flex-col w-full lg:flex-55">
      {/* PDF预览容器 */}
      <div className="bg-card border rounded-lg p-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">标签预览</h3>
        </div>

        {/* Canvas预览区 - 固定高度，内部可滚动 */}
        <div className="bg-muted/30 rounded-lg overflow-y-auto h-[700px]">
          {productsToDisplay.length > 0 ? (
            <div className="p-4 space-y-6">
              {productsToDisplay.map((product) => {
                // 根据5000规则拆分产品
                const { regularChunks, spareQuantity: spareQtyForProduct } = splitProductQuantity(product, spareQty);

                // 基于备品标签（最长文本）计算最优字体大小
                // Canvas 尺寸来自 LabelCanvas 的默认值
                const canvasWidth = 800;
                const canvasHeight = 600;
                const padding = 40;
                const tableWidth = canvasWidth - padding * 2;
                const valueColumnWidth = tableWidth * 0.72;
                const maxWidth = valueColumnWidth - 40;
                const baseFontSize = parseInt(fontSize, 10) || 20;
                const valueFontSize = baseFontSize + 4;

                // 使用备品标签文本（最长）为每个启用的样式计算字体大小
                let optimalFontSize = valueFontSize;
                enabledStyles.forEach((styleType) => {
                  const spareLabelText = product.productName + STYLE_SUFFIX[styleType] + '-备品';
                  const fontSizeForStyle = calculateOptimalFontSize(
                    spareLabelText,
                    maxWidth,
                    valueFontSize,
                    2, // 最大行数
                    14 // 最小字体大小
                  );
                  // 使用最小的字体大小以确保所有标签都能适配
                  optimalFontSize = Math.min(optimalFontSize, fontSizeForStyle);
                });

                return (
                  <div key={product.id} className="space-y-4">
                    {/* Product header */}
                    <div className="text-sm font-medium text-muted-foreground border-b pb-2">
                      {product.productName} - 订单号: {product.orderNumber}
                    </div>

                    {/* 常规标签：首先按数量块迭代，然后按样式 */}
                    {regularChunks.map((chunkQuantity, chunkIndex) => (
                      <div key={`${product.id}-chunk-${chunkIndex}`} className="space-y-4">
                        <div className="text-xs text-muted-foreground pl-2">
                          常规标签 - 第 {chunkIndex + 1} 组 ({chunkQuantity}张)
                        </div>
                        {enabledStyles.map((styleType) => (
                          <div key={`${product.id}-${chunkIndex}-${styleType}`} className="flex flex-col items-center">
                            <LabelCanvas
                              product={product}
                              style={styleType}
                              fontSize={parseInt(fontSize, 10) || 20}
                              width={800}
                              height={600}
                              displayQuantity={chunkQuantity}
                              isSpare={false}
                              overrideFontSize={optimalFontSize}
                            />
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* 备品标签：始终渲染，如果 spareQty 为 0 或 NaN，数量字段将为空 */}
                    <div className="space-y-4 border-t pt-4">
                      <div className="text-xs text-muted-foreground pl-2">
                        备品标签 {!Number.isNaN(spareQtyForProduct) && spareQtyForProduct > 0 && `(${spareQtyForProduct}张)`}
                      </div>
                      {enabledStyles.map((styleType) => (
                        <div key={`${product.id}-spare-${styleType}`} className="flex flex-col items-center">
                          <LabelCanvas
                            product={product}
                            style={styleType}
                            fontSize={parseInt(fontSize, 10) || 20}
                            width={800}
                            height={600}
                            displayQuantity={spareQtyForProduct}
                            isSpare={true}
                            overrideFontSize={optimalFontSize}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
