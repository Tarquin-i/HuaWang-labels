import * as XLSX from "xlsx";
import { Product } from "./mock-data";

export interface ParseResult {
  success: boolean;
  data?: Product[];
  error?: string;
}

/**
 * Parse Excel file and extract product data
 *
 * Required columns (必需列 - 缺少任何一列将导致验证失败):
 * - 产品名称 (Excel) → productName → 品名 (PDF标签)
 * - 订单编号 (Excel) → orderNumber → 订单号 (PDF标签)
 * - 产品编号 (Excel) → itemNumber → 货号 (PDF标签)
 * - 数量 (Excel) → quantity → 数量 (PDF标签，拆分后每张对应数量或备品数量)
 * - 批次 (Excel) → batch → 备注 (PDF标签)
 *
 * All fields are required. Missing any will result in a validation error.
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse workbook
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return {
        success: false,
        error: "Excel文件中没有找到工作表",
      };
    }

    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (jsonData.length < 2) {
      return {
        success: false,
        error: "Excel文件数据不足，至少需要标题行和一行数据",
      };
    }

    // Extract headers (first row)
    const headers = jsonData[0] as string[];

    // Find column indices
    const columnMap = findColumnIndices(headers);

    // Validate all required fields
    const missingFields = [];
    if (!columnMap.productName) missingFields.push("产品名称");
    if (!columnMap.orderNumber) missingFields.push("订单编号");
    if (!columnMap.itemNumber) missingFields.push("产品编号");
    if (!columnMap.quantity) missingFields.push("数量");
    if (!columnMap.batch) missingFields.push("批次");

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Excel文件缺少必要的列：${missingFields.join("、")}`,
      };
    }

    // Parse data rows
    const products: Product[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];

      // Skip empty rows
      if (!row || row.length === 0 || !row[columnMap.productName]) {
        continue;
      }

      try {
        const product: Product = {
          id: `${i}`,
          productName: String(row[columnMap.productName] || "").trim(),
          orderNumber: String(row[columnMap.orderNumber] || "").trim(),
          itemNumber: String(row[columnMap.itemNumber] || "").trim(),
          batch: String(row[columnMap.batch] || "").trim(),
          quantity: parseQuantity(row[columnMap.quantity]),
        };

        // Validate required fields
        if (!product.productName || !product.orderNumber || !product.itemNumber) {
          console.warn(`跳过第 ${i + 1} 行：缺少必要字段`);
          continue;
        }

        products.push(product);
      } catch (error) {
        console.warn(`解析第 ${i + 1} 行时出错:`, error);
        continue;
      }
    }

    if (products.length === 0) {
      return {
        success: false,
        error: "未能解析出有效的产品数据",
      };
    }

    return {
      success: true,
      data: products,
    };

  } catch (error) {
    // Don't log the full error stack to console, just return a user-friendly message
    let errorMessage = "文件解析失败";

    if (error instanceof Error) {
      // Detect specific error types and provide friendly messages
      if (error.message.includes("not a spreadsheet") ||
          error.message.includes("PNG") ||
          error.message.includes("image")) {
        errorMessage = "上传的文件不是有效的Excel文件，请检查文件格式";
      } else if (error.message.includes("Unexpected")) {
        errorMessage = "Excel文件格式不正确或已损坏";
      } else {
        errorMessage = "文件解析失败，请确保文件格式正确";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Find column indices by header names
 */
function findColumnIndices(headers: string[]): {
  productName?: number;
  orderNumber?: number;
  itemNumber?: number;
  quantity?: number;
  batch?: number;
} {
  const map: ReturnType<typeof findColumnIndices> = {};

  headers.forEach((header, index) => {
    const normalized = String(header || "").trim().toLowerCase();

    // Product Name - 产品名称
    if (
      normalized.includes("品名") ||
      normalized.includes("产品名称") ||
      normalized.includes("product name") ||
      normalized.includes("productname") ||
      normalized === "产品名称"
    ) {
      map.productName = index;
    }

    // Order Number - 订单编号
    else if (
      normalized.includes("订单号") ||
      normalized.includes("订单编号") ||
      normalized.includes("order number") ||
      normalized.includes("ordernumber") ||
      normalized.includes("order no") ||
      normalized === "订单编号"
    ) {
      map.orderNumber = index;
    }

    // Item Number - 产品编号 / 货号
    else if (
      normalized.includes("货号") ||
      normalized.includes("产品编号") ||
      normalized.includes("item number") ||
      normalized.includes("itemnumber") ||
      normalized.includes("item no") ||
      normalized === "产品编号"
    ) {
      map.itemNumber = index;
    }

    // Quantity - 数量
    else if (
      normalized.includes("数量") ||
      normalized.includes("quantity") ||
      normalized.includes("qty") ||
      normalized === "数量"
    ) {
      map.quantity = index;
    }

    // Batch / Remarks - 批次
    else if (
      normalized.includes("备注") ||
      normalized.includes("批次") ||
      normalized.includes("batch") ||
      normalized.includes("remarks") ||
      normalized.includes("remark") ||
      normalized === "批次"
    ) {
      map.batch = index;
    }
  });

  return map;
}

/**
 * Parse quantity from various formats
 * Examples: "3000", "3000张", "3,000", 3000
 */
function parseQuantity(value: any): number {
  if (typeof value === "number") {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    // Remove common suffixes and formatting
    const cleaned = value
      .replace(/[张个件片]/g, "")
      .replace(/,/g, "")
      .trim();

    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.floor(num);
  }

  return 0;
}
