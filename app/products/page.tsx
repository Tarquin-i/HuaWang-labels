"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductTable } from "@/components/product-table";
import { useProducts } from "@/lib/product-context";

export default function ProductsPage() {
  const router = useRouter();
  const { products, hasProducts, setSelectedProducts } = useProducts();

  // 如果没有产品，跳转到上传页面
  useEffect(() => {
    if (!hasProducts) {
      router.push("/upload");
    }
  }, [hasProducts, router]);

  const handleReimport = () => {
    router.push("/upload");
  };

  const handleGenerate = (selectedProducts: any[]) => {
    setSelectedProducts(selectedProducts);
    router.push("/generate");
  };

  // 如果没有产品，不渲染内容（等待跳转）
  if (!hasProducts) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">标签生成</h1>

        <ProductTable
          products={products}
          onReimport={handleReimport}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
