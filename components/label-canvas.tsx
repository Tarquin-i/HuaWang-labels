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
}

// Field labels for different styles
const FIELD_LABELS = {
  chinese: {
    productName: "品  名",
    orderNumber: "订单号",
    itemNumber: "货  号",
    quantity: "数  量",
    batch: "备  注",
  },
  english: {
    productName: "Product Name",
    orderNumber: "Order No",
    itemNumber: "Item No",
    quantity: "Quantity",
    batch: "Remarks",
  },
  silver: {
    productName: "品  名",
    orderNumber: "订单号",
    itemNumber: "货  号",
    quantity: "数  量",
    batch: "备  注",
  },
};

export function LabelCanvas({
  product,
  style,
  fontSize = 20,
  width = 800,
  height = 600,
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
    drawLabel(ctx, product, style, fontSize, width, height);
  }, [product, style, fontSize, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border rounded-lg shadow-sm bg-white"
    />
  );
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  product: Product,
  style: LabelStyle,
  baseFontSize: number,
  canvasWidth: number,
  canvasHeight: number
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

  // Get field labels based on style
  const labels = FIELD_LABELS[style];

  // Define rows
  const rows = [
    { label: labels.productName, value: product.productName },
    { label: labels.orderNumber, value: product.orderNumber },
    { label: labels.itemNumber, value: product.itemNumber },
    { label: labels.quantity, value: `${product.quantity}张` },
    { label: labels.batch, value: product.batch },
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
    // For product name, use smaller font if text is too long
    let valueFontSize = baseFontSize + 4;
    if (index === 0) {
      // Product name - may need to wrap or reduce size
      const maxWidth = valueColumnWidth - 40;
      ctx.font = `${valueFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;

      let textWidth = ctx.measureText(row.value).width;
      // Reduce font size if text is too long
      while (textWidth > maxWidth && valueFontSize > 14) {
        valueFontSize -= 2;
        ctx.font = `${valueFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
        textWidth = ctx.measureText(row.value).width;
      }
    } else {
      ctx.font = `${valueFontSize}px "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif`;
    }

    ctx.textAlign = "center";
    const valueX = startX + labelColumnWidth + valueColumnWidth / 2;
    const valueY = y + rowHeight / 2;
    ctx.fillText(row.value, valueX, valueY);
  });

  // Special styling for silver label (optional - can add metallic effect)
  if (style === "silver") {
    // Add a subtle overlay or border effect
    ctx.strokeStyle = "#c0c0c0";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX - 1, startY - 1, tableWidth + 2, tableHeight + 2);
  }
}
