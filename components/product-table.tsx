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
import { SearchIcon } from "lucide-react";
import { type Product } from "@/lib/mock-data";

interface ProductTableProps {
  products: Product[];
  onReimport: () => void;
  onGenerate: () => void;
}

export function ProductTable({
  products,
  onReimport,
  onGenerate,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.productName.toLowerCase().includes(query) ||
      product.orderNumber.toLowerCase().includes(query) ||
      product.itemNumber.toLowerCase().includes(query) ||
      product.batch.toLowerCase().includes(query)
    );
  });

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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  没有找到匹配的产品
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.productName}
                    <span className="text-muted-foreground ml-2">
                      (产品名称)
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.orderNumber}
                    <span className="text-muted-foreground ml-2">
                      (订单号)
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.itemNumber}
                    <span className="text-muted-foreground ml-2">(货号)</span>
                  </TableCell>
                  <TableCell>
                    {product.batch}
                    <span className="text-muted-foreground ml-2">(批次)</span>
                  </TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 生成标签按钮 */}
      <div className="flex justify-end">
        <Button
          onClick={onGenerate}
          size="lg"
          className="bg-black hover:bg-black/90 text-white"
        >
          生成标签
        </Button>
      </div>
    </div>
  );
}
