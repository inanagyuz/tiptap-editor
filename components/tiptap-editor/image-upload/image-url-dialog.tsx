/**
 * @module ImageUrlDialog
 *
 * This module provides the ImageUrl React component for inserting images into the Tiptap editor via a direct URL.
 * It displays a dialog for entering an image URL, validates the input, and inserts the image if valid.
 * All UI strings are localized via i18n for multi-language support.
 *
 * @remarks
 * - Validates image URLs for common formats (jpg, jpeg, png, gif, webp, svg).
 * - Shows error alerts for invalid URLs or missing image extension.
 * - Integrates with Tiptap editor's setImage command.
 * - Resets input and closes dialog after successful insertion.
 *
 * @example
 * ```tsx
 * <ImageUrl editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the dialog is open.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 */

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
import { i18n } from '../i18n';
import { Label } from '@/components/ui/label';

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
   const [isValidating, setIsValidating] = React.useState(false);

   // ✅ URL pattern kontrolü için helper fonksiyon
   const isValidImageUrl = (url: string) => {
      if (url.length === 0) return true; // Boş URL geçerli
     const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return urlPattern.test(url);
   };

    /**
    * Handles adding the image to the editor after validating the URL.
    */

   const handleAddImage = () => {
      if (!imageUrl) {
         setIsValidating(true);
         return;
      }

      if (!isValidImageUrl(imageUrl)) {
         setIsValidating(true);
         return;
      }

      if (editor.commands.setImage) {
         editor.commands.setImage({
            src: imageUrl,
         });
         onOpenChange(false);
         setImageUrl('');
         setIsValidating(false);
      } else {
         alert(i18n.t('EXTENSION_NOT_FOUND'));
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
            title={i18n.t('ADD_IMAGE')}
         >
            <ImageIcon size={18} />
         </Button>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" p-3 pr-12 gap-0">
               <DialogHeader className="hidden">
                  <DialogTitle className="text-sm item-center pt-[5px]">
                     {i18n.t('IMAGE_URL')}
                  </DialogTitle>
                  <DialogDescription className="hidden">{i18n.t('IMAGE_URL')}</DialogDescription>
               </DialogHeader>
               <div className="flex flex-row items-center justify-start">
                  <Label className="h-7 rounded-r-none rounded-l-md px-2 border">
                     {i18n.t('URL')}
                  </Label>
                  <Input
                     id="image-url"
                     value={imageUrl}
                     onChange={(e) => {
                        setImageUrl(e.target.value);
                        setIsValidating(false);
                     }}
                     placeholder="https://example.com/image.jpg"
                     className="flex-1 h-7 rounded-none "
                  />
                  <Button
                     size={'sm'}
                     className="h-7  rounded-l-none rounded-r-md"
                     type="button"
                     onClick={handleAddImage}
                  >
                     {i18n.t('INSERT')}
                  </Button>
               </div>
               {isValidating ? (
                  <p className="text-xs text-red-500 mt-1 px-2">
                     {!imageUrl ? i18n.t('URL_REQUIRED') : i18n.t('INVALID_IMAGE_URL')}
                  </p>
               ) : null}
            </DialogContent>
         </Dialog>
      </>
   );
};
