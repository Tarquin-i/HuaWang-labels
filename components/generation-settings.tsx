"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LabelPreview } from "@/components/label-preview";

interface GenerationSettingsProps {
  onCancel: () => void;
}

type GenerationStatus = "idle" | "success" | "error";

export function GenerationSettings({ onCancel }: GenerationSettingsProps) {
  const spareQuantityId = useId();
  const fontSizeId = useId();
  const chineseLabelId = useId();
  const englishLabelId = useId();
  const silverLabelId = useId();

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">
        {/* 左侧设置表单 */}
        <div className="bg-card border rounded-lg p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">生成标签设置</h3>
            <p className="text-sm text-muted-foreground mb-6">
              配置标签生成参数,系统将自动拆分超过 5000 数量的标签
            </p>
          </div>

          {/* 备品数量 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">备品数量 (每个产品款式)</h4>
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
            <h4 className="text-sm font-medium">标签字体大小</h4>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              标签字体大小
            </p>
          </div>

          {/* 选择标签款式 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">选择标签款式</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={chineseLabelId}
                checked={chineseLabel}
                onCheckedChange={(checked) =>
                  setChineseLabel(checked as boolean)
                }
              />
              <label
                htmlFor={chineseLabelId}
                className="text-sm cursor-pointer select-none"
              >
                中文吊牌
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={englishLabelId}
                checked={englishLabel}
                onCheckedChange={(checked) =>
                  setEnglishLabel(checked as boolean)
                }
              />
              <label
                htmlFor={englishLabelId}
                className="text-sm cursor-pointer select-none"
              >
                英文吊牌
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={silverLabelId}
                checked={silverLabel}
                onCheckedChange={(checked) =>
                  setSilverLabel(checked as boolean)
                }
              />
              <label
                htmlFor={silverLabelId}
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
          <div className="flex gap-3 pt-4 justify-end">
            <Button variant="outline" onClick={onCancel}>
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

        {/* 右侧PDF预览区域 */}
        <LabelPreview
          fontSize={fontSize}
          spareQuantity={spareQuantity}
          chineseLabel={chineseLabel}
          englishLabel={englishLabel}
          silverLabel={silverLabel}
          status={status}
          errorMessage="失败原因"
        />
      </div>
    </div>
  );
}
