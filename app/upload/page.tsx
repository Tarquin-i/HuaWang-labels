import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-sm text-muted-foreground">上传失败提示</h1>
            <h1 className="text-2xl font-bold">首页</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* 左侧错误提示区域 */}
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-medium mb-2">上传失败请重新上传</h3>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              <h3 className="font-medium mb-2">
                文件类型不符合上传类型,请重新上传
              </h3>
            </div>
          </div>

          {/* 右侧上传区域 */}
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">
              华旺标签生成
            </h1>
            <UploadZone />
          </div>
        </div>
      </div>
    </div>
  );
}
