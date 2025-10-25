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
  overrideFontSize?: number; // Override the calculated font size for product name
}

// Field labels - all in Chinese
const FIELD_LABELS = {
  productName: "品  名",
  orderNumber: "订单号",
  itemNumber: "货  号",
  quantity: "数  量",
  batch: "备  注",
};

// Style suffix to append to product name
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

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw label
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

// Helper function to wrap text into multiple lines
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
 * Calculate the optimal font size for a text to fit within maxLines
 * This function is used to ensure consistent font sizes across all labels
 *
 * @param text - The text to measure
 * @param maxWidth - Maximum width for text wrapping
 * @param baseFontSize - Initial font size to start with
 * @param maxLines - Maximum number of lines allowed (default: 2)
 * @param minFontSize - Minimum font size allowed (default: 14)
 * @returns The optimal font size that fits the text within maxLines
 */
export function calculateOptimalFontSize(
  text: string,
  maxWidth: number,
  baseFontSize: number,
  maxLines: number = 2,
  minFontSize: number = 14
): number {
  // Create a temporary canvas for measurement
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return baseFontSize;

  let currentFontSize = baseFontSize;

  while (currentFontSize >= minFontSize) {
    ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
    const textWidth = ctx.measureText(text).width;

    if (textWidth <= maxWidth) {
      // Text fits in one line
      return currentFontSize;
    } else {
      // Text needs wrapping
      const lines = wrapText(ctx, text, maxWidth);

      if (lines.length <= maxLines) {
        // Text fits within maxLines
        return currentFontSize;
      }
    }

    // Text doesn't fit, reduce font size and try again
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
  // Configuration
  const padding = 40;
  const tableWidth = canvasWidth - padding * 2;
  const tableHeight = canvasHeight - padding * 2;
  const rowHeight = tableHeight / 5; // 5 rows
  const labelColumnWidth = tableWidth * 0.28; // Left column ~28%
  const valueColumnWidth = tableWidth * 0.72; // Right column ~72%

  const startX = padding;
  const startY = padding;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Table border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, tableWidth, tableHeight);

  // Use displayQuantity if provided, otherwise use product.quantity
  const quantityToDisplay = displayQuantity !== undefined ? displayQuantity : product.quantity;

  // Format quantity value: show empty string if 0 or NaN, otherwise show "XXX张"
  const quantityValue = !Number.isNaN(quantityToDisplay) && quantityToDisplay > 0
    ? `${quantityToDisplay}张`
    : '';

  // Add spare suffix if this is a spare label
  const spareSuffix = isSpare ? '-备品' : '';

  // Define rows - append style suffix and spare suffix to product name
  const rows = [
    { label: FIELD_LABELS.productName, value: product.productName + STYLE_SUFFIX[style] + spareSuffix },
    { label: FIELD_LABELS.orderNumber, value: product.orderNumber },
    { label: FIELD_LABELS.itemNumber, value: product.itemNumber },
    { label: FIELD_LABELS.quantity, value: quantityValue },
    { label: FIELD_LABELS.batch, value: product.batch },
  ];

  // Draw rows
  rows.forEach((row, index) => {
    const y = startY + index * rowHeight;

    // Draw horizontal line (except for first row)
    if (index > 0) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + tableWidth, y);
      ctx.stroke();
    }

    // Draw vertical line (separator between label and value)
    ctx.beginPath();
    ctx.moveTo(startX + labelColumnWidth, y);
    ctx.lineTo(startX + labelColumnWidth, y + rowHeight);
    ctx.stroke();

    // Draw label (left column)
    ctx.fillStyle = "#000000";
    ctx.font = `bold ${baseFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const labelX = startX + labelColumnWidth / 2;
    const labelY = y + rowHeight / 2;
    ctx.fillText(row.label, labelX, labelY);

    // Draw value (right column)
    let valueFontSize = baseFontSize + 4;
    const maxWidth = valueColumnWidth - 40;

    if (index === 0) {
      // Product name - support multi-line wrapping (max 2 lines)
      const maxLines = 2;
      const minFontSize = 14;
      let currentFontSize: number;
      let lines: string[] = [];

      // Use overrideFontSize if provided, otherwise calculate font size
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
        // Calculate font size to fit within maxLines
        currentFontSize = valueFontSize;

        while (currentFontSize >= minFontSize) {
          ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
          const textWidth = ctx.measureText(row.value).width;

          if (textWidth <= maxWidth) {
            // Text fits in one line
            lines = [row.value];
            break;
          } else {
            // Text needs wrapping
            lines = wrapText(ctx, row.value, maxWidth);

            if (lines.length <= maxLines) {
              // Text fits within maxLines
              break;
            }
          }

          // Text doesn't fit, reduce font size and try again
          currentFontSize -= 1;
        }
      }

      // Use the final font size
      ctx.font = `bold ${currentFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;

      // Limit to maxLines
      const finalLines = lines.slice(0, maxLines);
      const lineHeight = currentFontSize * 1.2;
      const totalHeight = finalLines.length * lineHeight;
      const startLineY = y + (rowHeight - totalHeight) / 2 + lineHeight / 2;

      ctx.textAlign = "center";
      const valueX = startX + labelColumnWidth + valueColumnWidth / 2;

      if (finalLines.length === 1) {
        // Single line - center vertically
        const valueY = y + rowHeight / 2;
        ctx.fillText(finalLines[0], valueX, valueY);
      } else {
        // Multiple lines
        finalLines.forEach((line, lineIndex) => {
          const lineY = startLineY + lineIndex * lineHeight;
          ctx.fillText(line, valueX, lineY);
        });
      }
    } else {
      // Other fields - single line with bold font
      ctx.font = `bold ${valueFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
      ctx.textAlign = "center";
      const valueX = startX + labelColumnWidth + valueColumnWidth / 2;
      const valueY = y + rowHeight / 2;
      ctx.fillText(row.value, valueX, valueY);
    }
  });

  // Special styling for silver label (optional - can add metallic effect)
  if (style === "silver") {
    // Add a subtle overlay or border effect
    ctx.strokeStyle = "#c0c0c0";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX - 1, startY - 1, tableWidth + 2, tableHeight + 2);
  }
}
