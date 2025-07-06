// components/editor/image-gallery-dialog.tsx
'use client';

import * as React from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AlbumArtwork } from './album-artwork';
import { ImageGallerySchema } from '@/schemas/imageGallery';
import { Editor } from '@tiptap/react';
import { Images } from 'lucide-react';

interface ImageGalleryDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   editor: Editor;
}

export function ImageGalleryDialog({ open, onOpenChange, editor }: ImageGalleryDialogProps) {
   const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

   // Resim galerisini çek
   const { data, isLoading } = useQuery({
      queryKey: ['imageGallery'],
      queryFn: async () => {
         const response = await fetch('/api/admin/imageGallery', {
            method: 'GET',
         });
         if (!response.ok) throw new Error('NO_DATA');
         const { data, status } = await response.json();
         if (status !== 200) throw new Error('NO_DATA');
         return data;
      },
      enabled: open, // Dialog açıkken query'i çalıştır
   });

   const imageGallery = data as ImageGallerySchema[] | [];

   // Resim seçme işlemi
   const handleSelectImage = (url: string) => {
      setSelectedImage(url);
   };

   // Seçilen resmi editöre ekleme
   const handleInsertImage = () => {
      if (selectedImage) {
         editor.chain().focus().setImage({ src: selectedImage }).run();
         onOpenChange(false);
         setSelectedImage(null);
      }
   };

   return (
      <>
         <Button
            size="sm"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            className="rounded-none h-8 w-8 p-0"
            title="Add Twitter Post"
         >
            <Images size={18} />
         </Button>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
               <DialogHeader>
                  <DialogTitle>{'SELECT_IMAGE_FROM_GALLERY'}</DialogTitle>
               </DialogHeader>

               <div className="py-4 max-h-[480px] overflow-y-auto">
                  {isLoading ? (
                     <div className="flex items-center justify-center h-40">
                        <Loader className="animate-spin" />
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imageGallery?.length > 0 ? (
                           imageGallery.map((album: ImageGallerySchema) => {
                              if (!album) return null; // URL yoksa geç
                              return (
                                 <div
                                    key={album.id}
                                    className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                                       selectedImage === album.url
                                          ? 'border-primary ring-2 ring-primary/30'
                                          : 'border-transparent hover:border-muted'
                                    }`}
                                    onClick={() => handleSelectImage(album.url as string)}
                                 >
                                    <AlbumArtwork
                                       album={album}
                                       className="w-full h-full"
                                       aspectRatio="square"
                                       width={150}
                                       height={150}
                                    />
                                 </div>
                              );
                           })
                        ) : (
                           <div className="col-span-full text-center py-10 text-muted-foreground">
                              {'NO_IMAGES'}
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                     {'CANCEL'}
                  </Button>
                  <Button onClick={handleInsertImage} disabled={!selectedImage}>
                     {'INSERT'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}
