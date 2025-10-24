"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "./mock-data";

interface ProductContextType {
  products: Product[];
  selectedProducts: Product[];
  setProducts: (products: Product[]) => void;
  setSelectedProducts: (products: Product[]) => void;
  clearProducts: () => void;
  hasProducts: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProductsState] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProductsState] = useState<Product[]>([]);

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
    // Clear selected products when new products are loaded
    setSelectedProductsState([]);
  };

  const setSelectedProducts = (selected: Product[]) => {
    setSelectedProductsState(selected);
  };

  const clearProducts = () => {
    setProductsState([]);
    setSelectedProductsState([]);
  };

  const hasProducts = products.length > 0;

  return (
    <ProductContext.Provider
      value={{
        products,
        selectedProducts,
        setProducts,
        setSelectedProducts,
        clearProducts,
        hasProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
