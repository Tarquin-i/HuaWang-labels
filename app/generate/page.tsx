"use client";

import { useRouter } from "next/navigation";
import { GenerationSettings } from "@/components/generation-settings";

export default function GeneratePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/products");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">标签生成</h1>
        <GenerationSettings onCancel={handleCancel} />
      </div>
    </div>
  );
}
