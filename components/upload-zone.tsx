"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { parseExcelFile } from "@/lib/excel-parser";
import { useProducts } from "@/lib/product-context";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setProducts } = useProducts();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));

    // Validate file extension
    if (!validExtensions.includes(fileExtension.toLowerCase())) {
      toast.error("文件类型不符合上传类型,请重新上传", {
        description: "仅支持 .xlsx 和 .xls 格式",
      });
      return;
    }

    // Validate file MIME type
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];

    if (!validMimeTypes.includes(file.type) && file.type !== "") {
      toast.error("文件格式错误", {
        description: `检测到的文件类型为：${file.type || "未知"}。请确保上传的是真实的Excel文件，而不是重命名的其他格式文件。`,
        duration: 5000,
      });
      return;
    }

    // Start parsing
    setIsUploading(true);
    const loadingToast = toast.loading("正在解析Excel文件...");

    try {
      const result = await parseExcelFile(file);

      toast.dismiss(loadingToast);

      if (result.success && result.data) {
        // Store parsed products in context
        setProducts(result.data);

        toast.success("文件解析成功", {
          description: `成功解析 ${result.data.length} 条产品数据`,
        });

        // Navigate to products page
        setTimeout(() => {
          router.push("/products");
        }, 500);
      } else {
        toast.error("文件解析失败", {
          description: result.error || "未知错误",
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      // Just show a simple error message, specific details are already in result.error
      toast.error("文件处理失败", {
        description: error instanceof Error ? error.message : "请检查文件格式是否正确",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        bg-card border rounded-xl p-20
        transition-all duration-200
        shadow-sm
        ${isDragging ? "border-primary border-2 bg-primary/5 scale-[1.02]" : "border-border"}
      `}
    >
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">拖拽文件到此处</h3>
          <div className="space-y-1">
            <p className="text-base text-muted-foreground">选择 Excel 文件</p>
            <p className="text-base text-muted-foreground">支持.xlsx 和 .xls 格式</p>
          </div>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          size="lg"
          className="bg-black hover:bg-black/90 text-white px-12 py-6 text-base"
          disabled={isUploading}
        >
          <FileIcon className="mr-2 h-5 w-5" />
          {isUploading ? "解析中..." : "选择文件"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
