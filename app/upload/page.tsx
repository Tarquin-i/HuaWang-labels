import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-12">
          华旺标签生成
        </h1>
        <UploadZone />
      </div>
    </div>
  );
}
