import * as React from 'react';
import { Editor } from '@tiptap/react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'; // Dialog bileşenlerinizin yolu
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon } from 'lucide-react';

export const ImageUrl = ({
   editor,
   open, // Dışarıdan gelen open state'i
   onOpenChange, // Dışarıdan gelen state güncelleme fonksiyonu
}: {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}) => {
   const [imageUrl, setImageUrl] = React.useState('');

   const handleAddImage = () => {
      if (imageUrl) {
         if (editor.commands.setImage) {
            editor.commands.setImage({
               src: imageUrl,
            });
            onOpenChange(false); // Dialog'u kapat
            // Inputları sıfırla
            setImageUrl('');
         } else {
            alert('Resim eklentisi bulunamadı veya doğru yapılandırılmadı.');
         }
      } else {
         alert('Lütfen geçerli bir resim URL girin.');
      }
   };
   if (!editor) return null;
   return (
      <>
         <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            className="rounded-none h-8 w-8 p-0"
            title="Add Image"
         >
            <ImageIcon size={18} />
         </Button>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-72 flex flex-row items-center justify-start p-3 pr-12 gap-0">
               <DialogHeader className="bg-accent h-7 px-2 rounded-l-md border border-r-none item-center ">
                  <DialogTitle className="text-sm item-center pt-[5px]">URL</DialogTitle>
                  <DialogDescription className="hidden">
                     Anyone who has this link will be able to view this.
                  </DialogDescription>
               </DialogHeader>
               <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 h-7 rounded-none "
               />
               <Button
                  size={'sm'}
                  className="h-7  rounded-l-none rounded-r-md"
                  type="button"
                  onClick={handleAddImage}
               >
                  Ekle
               </Button>
            </DialogContent>
         </Dialog>
      </>
   );
};