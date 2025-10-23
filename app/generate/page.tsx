"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GenerationDialog } from "@/components/generation-dialog";

export default function GeneratePage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 页面加载时自动打开弹窗
    setOpen(true);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // 关闭弹窗时返回产品列表页
      router.push("/products");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">标签生成</h1>
        <GenerationDialog open={open} onOpenChange={handleOpenChange} />
      </div>
    </div>
  );
}
