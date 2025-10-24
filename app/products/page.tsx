"use client";

import { useRouter } from "next/navigation";
import { ProductTable } from "@/components/product-table";
import { useProducts } from "@/lib/product-context";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  const { products, hasProducts, setSelectedProducts } = useProducts();

  const handleReimport = () => {
    router.push("/upload");
  };

  const handleGenerate = (selectedProducts: any[]) => {
    setSelectedProducts(selectedProducts);
    router.push("/generate");
  };

  // Show empty state if no products
  if (!hasProducts) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <FileIcon className="w-16 h-16 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">暂无产品数据</h2>
            <p className="text-muted-foreground">
              请先上传Excel文件以导入产品数据
            </p>
          </div>
          <Button
            onClick={handleReimport}
            className="bg-black hover:bg-black/90 text-white"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            上传Excel文件
          </Button>
        </div>
      </div>
    );
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
