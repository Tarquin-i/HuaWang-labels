"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
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
        >
          <FileIcon className="mr-2 h-5 w-5" />
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
  );
}
