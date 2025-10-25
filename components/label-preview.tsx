"use client";

import { CircleCheckIcon, OctagonXIcon } from "lucide-react";
import { LabelCanvas, type LabelStyle, calculateOptimalFontSize } from "./label-canvas";
import { Product } from "@/lib/mock-data";
import { useProducts } from "@/lib/product-context";

// Style suffix to append to product name (same as in label-canvas.tsx)
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

// Split product into chunks based on 5000 rule
function splitProductQuantity(product: Product, spareQuantity: number): {
  regularChunks: number[];
  spareQuantity: number;
} {
  const regularChunks: number[] = [];
  const quantity = product.quantity;

  // Split regular labels
  if (quantity > 5000) {
    const chunks = Math.floor(quantity / 5000);
    const remainder = quantity % 5000;

    // Full 5000 chunks
    for (let i = 0; i < chunks; i++) {
      regularChunks.push(5000);
    }

    // Remainder chunk
    if (remainder > 0) {
      regularChunks.push(remainder);
    }
  } else {
    // Single label for quantities <= 5000
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

  // Determine which styles are enabled
  const enabledStyles: LabelStyle[] = [];
  if (chineseLabel) enabledStyles.push("chinese");
  if (englishLabel) enabledStyles.push("english");
  if (silverLabel) enabledStyles.push("silver");

  // Use all selected products, not just the preview product
  const productsToDisplay = selectedProducts.length > 0 ? selectedProducts : (previewProduct ? [previewProduct] : []);

  // Parse spare quantity - allow 0 or NaN (will show empty in label)
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
                // Split product into chunks based on 5000 rule
                const { regularChunks, spareQuantity: spareQtyForProduct } = splitProductQuantity(product, spareQty);

                // Calculate optimal font size based on spare label (longest text)
                // Canvas dimensions from LabelCanvas defaults
                const canvasWidth = 800;
                const canvasHeight = 600;
                const padding = 40;
                const tableWidth = canvasWidth - padding * 2;
                const valueColumnWidth = tableWidth * 0.72;
                const maxWidth = valueColumnWidth - 40;
                const baseFontSize = parseInt(fontSize, 10) || 20;
                const valueFontSize = baseFontSize + 4;

                // Calculate font size for each enabled style, using spare label text (longest)
                let optimalFontSize = valueFontSize;
                enabledStyles.forEach((styleType) => {
                  const spareLabelText = product.productName + STYLE_SUFFIX[styleType] + '-备品';
                  const fontSizeForStyle = calculateOptimalFontSize(
                    spareLabelText,
                    maxWidth,
                    valueFontSize,
                    2, // maxLines
                    14 // minFontSize
                  );
                  // Use the smallest font size to ensure all labels fit
                  optimalFontSize = Math.min(optimalFontSize, fontSizeForStyle);
                });

                return (
                  <div key={product.id} className="space-y-4">
                    {/* Product header */}
                    <div className="text-sm font-medium text-muted-foreground border-b pb-2">
                      {product.productName} - 订单号: {product.orderNumber}
                    </div>

                    {/* Regular labels: First iterate by quantity chunks, then by styles */}
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

                    {/* Spare labels: Always render, quantity field will be empty if spareQty is 0 or NaN */}
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
