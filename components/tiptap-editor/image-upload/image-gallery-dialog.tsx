/**
 * @module ImageGalleryDialog
 *
 * This module provides the ImageGalleryDialog React component for selecting and inserting images from the gallery into the Tiptap editor.
 * It displays a modal dialog with a grid of images, loading indicator, and localized UI via i18n.
 *
 * @remarks
 * - Fetches image gallery items from the API.
 * - Allows users to select and insert images into the editor.
 * - Shows loading spinner while fetching images.
 * - Displays localized messages for empty gallery, cancel, and insert actions.
 * - Integrates AlbumArtwork component for image previews.
 *
 * @example
 * ```tsx
 * <ImageGalleryDialog open={open} onOpenChange={setOpen} editor={editor} />
 * ```
 *
 * @property open - Whether the dialog is open.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 * @property editor - The Tiptap editor instance.
 */
'use client';

import * as React from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AlbumArtwork } from './album-artwork';
import { ImageGallerySchema } from '@/schemas/image-gallery';
import { Editor } from '@tiptap/react';
import { Images } from 'lucide-react';
import { i18n } from '../i18n';

interface ImageGalleryDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   editor: Editor;
}

/**
 * ImageGalleryDialog component for selecting and inserting images from the gallery.
 *
 * @param open - Whether the dialog is open.
 * @param onOpenChange - Callback fired when the dialog is opened or closed.
 * @param editor - The Tiptap editor instance.
 */

export function ImageGalleryDialog({ open, onOpenChange, editor }: ImageGalleryDialogProps) {
   const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
   const getApi = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
   if (!getApi) {
      throw new Error('Image upload API endpoint is not configured.');
   }
   // Resim galerisini çek
   const { data, isLoading } = useQuery({
      queryKey: ['imageGallery'],
      queryFn: async () => {
         const response = await fetch(getApi, {
            method: 'GET',
         });
         if (!response.ok) throw new Error(i18n.t('NO_DATA'));
         const { data, status } = await response.json();
         if (status !== 200) throw new Error(i18n.t('NO_DATA'));
         return data;
      },
      enabled: open,
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
            title={i18n.t('ADD_IMAGE')}
         >
            <Images size={18} />
         </Button>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[360px]">
               <DialogHeader>
                  <DialogTitle>{i18n.t('SELECT_IMAGE_FROM_GALLERY')}</DialogTitle>
                  <DialogDescription>
                     {i18n.t('SELECT_IMAGE_FROM_GALLERY_DESCRIPTION')}
                  </DialogDescription>
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
                              {i18n.t('NO_IMAGES')}
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                     {i18n.t('CANCEL')}
                  </Button>
                  <Button onClick={handleInsertImage} disabled={!selectedImage}>
                     {i18n.t('INSERT')}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}
