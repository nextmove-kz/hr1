import { FileUploader } from "@/components/FileUploader";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PDF Resume Parser</h1>
      <FileUploader />
    </main>
  );
}
