import { FileUploader } from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

export default function Home() {
  return (
    <Dialog className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Загрузить резюме</h1>
      <DialogTrigger asChild>
        <Button className="mb-6" variant="secondary">
          +
        </Button>
      </DialogTrigger>
      <FileUploader />
    </Dialog>
  );
}
