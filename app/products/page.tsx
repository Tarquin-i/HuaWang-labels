"use client";

import { useRouter } from "next/navigation";
import { ProductTable } from "@/components/product-table";
import { mockProducts } from "@/lib/mock-data";

export default function ProductsPage() {
  const router = useRouter();

  const handleReimport = () => {
    router.push("/upload");
  };

  const handleGenerate = () => {
    router.push("/generate");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-muted-foreground">产品选择页</span>
          </div>
          <h1 className="text-3xl font-bold">标签生成</h1>
        </div>

        <ProductTable
          products={mockProducts}
          onReimport={handleReimport}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
