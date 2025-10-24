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
        <h1 className="text-3xl font-bold text-center mb-8">标签生成</h1>

        <ProductTable
          products={mockProducts}
          onReimport={handleReimport}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}
