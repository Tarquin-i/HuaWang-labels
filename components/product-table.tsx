"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchIcon } from "lucide-react";
import { type Product } from "@/lib/mock-data";

interface ProductTableProps {
  products: Product[];
  onReimport: () => void;
  onGenerate: (selectedProducts: Product[]) => void;
}

export function ProductTable({
  products,
  onReimport,
  onGenerate,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.productName.toLowerCase().includes(query) ||
      product.orderNumber.toLowerCase().includes(query) ||
      product.itemNumber.toLowerCase().includes(query) ||
      product.batch.toLowerCase().includes(query)
    );
  });

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // 单选/取消单选
  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  // 判断是否全选
  const isAllSelected =
    filteredProducts.length > 0 &&
    selectedProducts.length === filteredProducts.length;

  return (
    <div className="space-y-6">
      {/* 标题和重新导入按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">产品列表</h2>
        <Button
          variant="outline"
          onClick={onReimport}
          className="border-border hover:bg-accent"
        >
          重新导入
        </Button>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索产品名称、订单号、货号、批次"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 产品表格 */}
      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>产品名称</TableHead>
                <TableHead>订单号</TableHead>
                <TableHead>货号</TableHead>
                <TableHead>批次</TableHead>
                <TableHead className="text-right">数量</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  没有找到匹配的产品
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>
                    {product.orderNumber}
                  </TableCell>
                  <TableCell>
                    {product.itemNumber}
                  </TableCell>
                  <TableCell>
                    {product.batch}
                  </TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* 生成标签按钮 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          已选择 {selectedProducts.length} 个产品
        </p>
        <Button
          onClick={() => {
            const selected = products.filter((p) =>
              selectedProducts.includes(p.id)
            );
            onGenerate(selected);
          }}
          size="lg"
          className="bg-black hover:bg-black/90 text-white"
          disabled={selectedProducts.length === 0}
        >
          生成标签 ({selectedProducts.length})
        </Button>
      </div>
    </div>
  );
}
