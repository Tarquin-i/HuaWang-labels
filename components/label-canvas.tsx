"use client";

import { useEffect, useRef } from "react";
import { Product } from "@/lib/mock-data";

export type LabelStyle = "chinese" | "english" | "silver";

interface LabelCanvasProps {
  product: Product;
  style: LabelStyle;
  fontSize?: number;
  width?: number;
  height?: number;
  displayQuantity?: number; // Override quantity display
  isSpare?: boolean; // Whether this is a spare label
  overrideFontSize?: number; // 覆盖产品名称的计算字体大小
}

// 字段标签 - 全部中文
const FIELD_LABELS = {
  productName: "品  名",
  orderNumber: "订单号",
  itemNumber: "货  号",
  quantity: "数  量",
  batch: "备  注",
};

// 追加到产品名称的样式后缀
const STYLE_SUFFIX: Record<LabelStyle, string> = {
  chinese: "-中文吊牌",
  english: "-英文吊牌",
  silver: "-烫银吊牌",
};

export function LabelCanvas({
  product,
  style,
  fontSize = 20,
  width = 800,
  height = 600,
  displayQuantity,
  isSpare = false,
  overrideFontSize,
}: LabelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制标签
    drawLabel(ctx, product, style, fontSize, width, height, displayQuantity, isSpare, overrideFontSize);
  }, [product, style, fontSize, width, height, displayQuantity, isSpare, overrideFontSize]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border rounded-lg shadow-sm bg-white"
    />
  );
}

// 辅助函数：将文本包装成多行
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const chars = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (const char of chars) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [text];
}

/**
 * 计算文本在最大行数内的最优字体大小
 * 此函数用于确保所有标签的字体大小一致
 *
 * @param text - 要测量的文本
 * @param maxWidth - 文本包装的最大宽度
 * @param baseFontSize - 初始字体大小
 * @param maxLines - 允许的最大行数（默认：2）
 * @param minFontSize - 允许的最小字体大小（默认：14）
 * @returns 能够在最大行数内容纳文本的最优字体大小
 */
export function calculateOptimalFontSize(
  text: string,
  maxWidth: number,
  baseFontSize: number,
  maxLines: number = 2,
  minFontSize: number = 14
): number {
  // 创建一个临时画布用于测量
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return baseFontSize;

  let currentFontSize = baseFontSize;

  while (currentFontSize >= minFontSize) {
    ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
    const textWidth = ctx.measureText(text).width;

    if (textWidth <= maxWidth) {
      // 文本适合单行
      return currentFontSize;
    } else {
      // 文本需要包装
      const lines = wrapText(ctx, text, maxWidth);

      if (lines.length <= maxLines) {
        // 文本适合最大行数
        return currentFontSize;
      }
    }

    // 文本不适合，减小字体大小并重试
    currentFontSize -= 1;
  }

  return minFontSize;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  product: Product,
  style: LabelStyle,
  baseFontSize: number,
  canvasWidth: number,
  canvasHeight: number,
  displayQuantity?: number,
  isSpare?: boolean,
  overrideFontSize?: number
) {
  // 配置
  const padding = 40;
  const tableWidth = canvasWidth - padding * 2;
  const tableHeight = canvasHeight - padding * 2;
  const rowHeight = tableHeight / 5; // 5行
  const labelColumnWidth = tableWidth * 0.28; // 左列 ~28%
  const valueColumnWidth = tableWidth * 0.72; // 右列 ~72%

  const startX = padding;
  const startY = padding;

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 表格边框
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, tableWidth, tableHeight);

  // 如果提供了 displayQuantity，使用它，否则使用 product.quantity
  const quantityToDisplay = displayQuantity !== undefined ? displayQuantity : product.quantity;

  // 格式化数量值：如果为 0 或 NaN 显示空字符串，否则显示 "XXX张"
  const quantityValue = !Number.isNaN(quantityToDisplay) && quantityToDisplay > 0
    ? `${quantityToDisplay}张`
    : '';

  // 如果这是备品标签，添加备品后缀
  const spareSuffix = isSpare ? '-备品' : '';

  // 定义行 - 将样式后缀和备品后缀追加到产品名称
  const rows = [
    { label: FIELD_LABELS.productName, value: product.productName + STYLE_SUFFIX[style] + spareSuffix },
    { label: FIELD_LABELS.orderNumber, value: product.orderNumber },
    { label: FIELD_LABELS.itemNumber, value: product.itemNumber },
    { label: FIELD_LABELS.quantity, value: quantityValue },
    { label: FIELD_LABELS.batch, value: product.batch },
  ];

  // 绘制行
  rows.forEach((row, index) => {
    const y = startY + index * rowHeight;

    // 绘制水平线（除了第一行）
    if (index > 0) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + tableWidth, y);
      ctx.stroke();
    }

    // 绘制垂直线（标签和值之间的分隔符）
    ctx.beginPath();
    ctx.moveTo(startX + labelColumnWidth, y);
    ctx.lineTo(startX + labelColumnWidth, y + rowHeight);
    ctx.stroke();

    // 绘制标签（左列）
    ctx.fillStyle = "#000000";
    ctx.font = `bold ${baseFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labelX = startX + labelColumnWidth / 2;
    const labelY = y + rowHeight / 2;
    ctx.fillText(row.label, labelX, labelY);

    // 绘制值（右列）
    let valueFontSize = baseFontSize + 4;
    const maxWidth = valueColumnWidth - 40;

    if (index === 0) {
      // 产品名称 - 支持多行包装（最多2行）
      const maxLines = 2;
      const minFontSize = 14;
      let currentFontSize: number;
      let lines: string[] = [];

      // 如果提供了 overrideFontSize，使用它，否则计算字体大小
      if (overrideFontSize !== undefined) {
        currentFontSize = overrideFontSize;
        ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
        const textWidth = ctx.measureText(row.value).width;

        if (textWidth <= maxWidth) {
          lines = [row.value];
        } else {
          lines = wrapText(ctx, row.value, maxWidth);
        }
      } else {
        // 计算适合最大行数的字体大小
        currentFontSize = valueFontSize;

        while (currentFontSize >= minFontSize) {
          ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
          const textWidth = ctx.measureText(row.value).width;

          if (textWidth <= maxWidth) {
            // 文本适合单行
            lines = [row.value];
            break;
          } else {
            // 文本需要包装
            lines = wrapText(ctx, row.value, maxWidth);

            if (lines.length <= maxLines) {
              // 文本适合最大行数
              break;
            }
          }

          // 文本不适合，减小字体大小并重试
          currentFontSize -= 1;
        }
      }

      // 使用最终字体大小
      ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;

      // 限制为最大行数
      const finalLines = lines.slice(0, maxLines);
      const lineHeight = currentFontSize * 1.2;
      const totalHeight = finalLines.length * lineHeight;
      const startLineY = y + (rowHeight - totalHeight) / 2 + lineHeight / 2;

      ctx.textAlign = "center";
      const valueX = startX + labelColumnWidth + valueColumnWidth / 2;

      if (finalLines.length === 1) {
        // 单行 - 垂直居中
        const valueY = y + rowHeight / 2;
        ctx.fillText(finalLines[0], valueX, valueY);
      } else {
        // 多行
        finalLines.forEach((line, lineIndex) => {
          const lineY = startLineY + lineIndex * lineHeight;
          ctx.fillText(line, valueX, lineY);
        });
      }
    } else {
      // 其他字段 - 单行加粗字体
      ctx.font = `bold ${valueFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
      ctx.textAlign = "center";
      const valueX = startX + labelColumnWidth + valueColumnWidth / 2;
      const valueY = y + rowHeight / 2;
      ctx.fillText(row.value, valueX, valueY);
    }
  });

  // 烫银标签的特殊样式（可选 - 可以添加金属效果）
  if (style === "silver") {
    // 添加微妙的覆盖层或边框效果
    ctx.strokeStyle = "#c0c0c0";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX - 1, startY - 1, tableWidth + 2, tableHeight + 2);
  }
}
