"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GenerationSettings } from "@/components/generation-settings";
import { useProducts } from "@/lib/product-context";

export default function GeneratePage() {
  const router = useRouter();
  const { selectedProducts } = useProducts();

  // 如果没有选择产品，跳转到产品页面
  useEffect(() => {
    if (!selectedProducts || selectedProducts.length === 0) {
      router.push("/products");
    }
  }, [selectedProducts, router]);

  const handleCancel = () => {
    router.push("/products");
  };

  // 如果没有选择产品，不渲染内容（等待跳转）
  if (!selectedProducts || selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">标签生成</h1>
        <GenerationSettings onCancel={handleCancel} />
      </div>
    </div>
  );
}
