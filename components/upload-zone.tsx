"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

  const handleFile = (file: File) => {
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension.toLowerCase())) {
      toast.error("文件类型不符合上传类型,请重新上传", {
        description: "仅支持 .xlsx 和 .xls 格式",
      });
      return;
    }

    // 模拟上传过程
    toast.loading("正在上传文件...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("文件上传成功");
      // 跳转到产品列表页
      setTimeout(() => {
        router.push("/products");
      }, 500);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-16
          transition-colors duration-200
          ${isDragging ? "border-primary bg-primary/5" : "border-border"}
        `}
      >
        <div className="flex flex-col items-center gap-6">
          <UploadIcon className="w-16 h-16 text-muted-foreground" />

          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">拖拽文件到此处</h3>
            <p className="text-sm text-muted-foreground mb-1">选择 Excel 文件</p>
            <p className="text-sm text-muted-foreground">支持.xlsx 和 .xls 格式</p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="bg-black hover:bg-black/90 text-white"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            选择文件
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
    </div>
  );
}
