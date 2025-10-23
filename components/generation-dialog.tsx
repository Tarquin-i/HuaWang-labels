"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CircleCheckIcon, OctagonXIcon } from "lucide-react";

interface GenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type GenerationStatus = "idle" | "success" | "error";

export function GenerationDialog({
  open,
  onOpenChange,
}: GenerationDialogProps) {
  const [spareQuantity, setSpareQuantity] = useState("200");
  const [fontSize, setFontSize] = useState("10");
  const [chineseLabel, setChineseLabel] = useState(true);
  const [englishLabel, setEnglishLabel] = useState(true);
  const [silverLabel, setSilverLabel] = useState(true);
  const [status, setStatus] = useState<GenerationStatus>("idle");

  const selectedStyles = [chineseLabel, englishLabel, silverLabel].filter(
    Boolean
  ).length;

  const handleConfirm = () => {
    // 模拟生成过程
    const success = Math.random() > 0.3; // 70% 成功率
    setStatus(success ? "success" : "error");
  };

  const handleCancel = () => {
    onOpenChange(false);
    // 重置状态
    setTimeout(() => {
      setStatus("idle");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>标签生成弹窗</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* 左侧设置表单 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">生成标签设置</h3>
              <p className="text-sm text-muted-foreground mb-6">
                配置标签生成参数,系统将自动拆分超过 5000 数量的标签
              </p>
            </div>

            {/* 备品数量 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                备品数量 (每个产品款式)
              </label>
              <Input
                type="number"
                value={spareQuantity}
                onChange={(e) => setSpareQuantity(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                每个产品的每种款式都会生成一张备品标签
              </p>
            </div>

            {/* 标签字体大小 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">标签字体大小</label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="max-w-xs"
              />
            </div>

            {/* 选择标签款式 */}
            <div className="space-y-3">
              <label className="text-sm font-medium">选择标签款式</label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chinese"
                  checked={chineseLabel}
                  onCheckedChange={(checked) =>
                    setChineseLabel(checked as boolean)
                  }
                />
                <label
                  htmlFor="chinese"
                  className="text-sm cursor-pointer select-none"
                >
                  中文吊牌
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="english"
                  checked={englishLabel}
                  onCheckedChange={(checked) =>
                    setEnglishLabel(checked as boolean)
                  }
                />
                <label
                  htmlFor="english"
                  className="text-sm cursor-pointer select-none"
                >
                  英文吊牌
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="silver"
                  checked={silverLabel}
                  onCheckedChange={(checked) =>
                    setSilverLabel(checked as boolean)
                  }
                />
                <label
                  htmlFor="silver"
                  className="text-sm cursor-pointer select-none"
                >
                  烫银吊牌
                </label>
              </div>
            </div>

            {/* 生成摘要 */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">生成摘要</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">选择产品:</span>
                  <span className="ml-2 font-medium">4</span>
                </div>
                <div>
                  <span className="text-muted-foreground">启用款式:</span>
                  <span className="ml-2 font-medium">{selectedStyles}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">常规标签:</span>
                  <span className="ml-2 font-medium">15 张</span>
                </div>
                <div>
                  <span className="text-muted-foreground">备品标签:</span>
                  <span className="ml-2 font-medium">12 张</span>
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-black hover:bg-black/90 text-white"
                disabled={status !== "idle"}
              >
                确认生成
              </Button>
            </div>
          </div>

          {/* 右侧状态显示 */}
          <div className="space-y-4">
            {status === "success" && (
              <div className="border rounded-lg p-6 bg-green-50 border-green-200">
                <div className="flex items-center gap-3 text-green-700">
                  <CircleCheckIcon className="w-6 h-6" />
                  <h4 className="font-medium text-lg">生成成功</h4>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="border rounded-lg p-6 bg-red-50 border-red-200">
                <div className="flex items-center gap-3 text-red-700 mb-2">
                  <OctagonXIcon className="w-6 h-6" />
                  <h4 className="font-medium text-lg">生成失败</h4>
                </div>
                <p className="text-sm text-red-600 ml-9">失败原因</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
