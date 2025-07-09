// components/editor/selector/image-selector.tsx
'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { ImagePlus, Images, Link2, Upload, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { AlbumArtwork } from '../image-upload/album-artwork';
import { ImageGallerySchema } from '@/schemas/image-gallery';
import { cn } from '../tiptap-utils';

import { useQuery } from '@tanstack/react-query';

interface ImageSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   // Gallery props
   imageGalleryOpen: boolean;
   onImageGalleryOpenChange: (open: boolean) => void;
   // URL props
   imageUrlOpen: boolean;
   onImageUrlOpenChange: (open: boolean) => void;
}

export const ImageSelector = ({
   editor,
   open,
   onOpenChange,
   imageGalleryOpen,
   onImageGalleryOpenChange,
   imageUrlOpen,
   onImageUrlOpenChange,
}: ImageSelectorProps) => {
   const [imageUrl, setImageUrl] = useState('');
   const [selectedImage, setSelectedImage] = useState<string | null>(null);

   // ✅ Gallery API Query
   const { data: galleryData, isLoading: isGalleryLoading } = useQuery({
      queryKey: ['imageGallery'],
      queryFn: async () => {
         const galleryUrl = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
         if (!galleryUrl) {
            throw new Error('NO_IMAGE_GALLERY_URL');
         }
         const response = await fetch(galleryUrl, {
            method: 'GET',
         });
         if (!response.ok) throw new Error('NO_DATA');
         const { data, status } = await response.json();
         if (status !== 200) throw new Error('NO_DATA');
         return data;
      },
      enabled: imageGalleryOpen, // Gallery açıkken query'i çalıştır
      retry: 1, // Hata durumunda 1 kez daha dene
   });

   const imageGallery = galleryData as ImageGallerySchema[] | [];

   // Upload işlemi
   const handleUpload = () => {
      editor
         .chain()
         .focus()
         .setImageUploadNode({
            accept: 'image/*',
            limit: 1,
            maxSize: 5 * 1024 * 1024, // 5MB
         })
         .run();
      onOpenChange(false);
   };

   // URL'den resim ekleme
   const handleImageUrl = () => {
      if (imageUrl && imageUrl.trim()) {
         editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
         setImageUrl('');
         onImageUrlOpenChange(false);
      }
   };

   // Gallery açma
   const handleGallery = () => {
      onOpenChange(false);
      onImageGalleryOpenChange(true);
   };

   // ✅ Gallery'den resim seçme
   const handleSelectImage = (url: string) => {
      setSelectedImage(url);
   };

   // ✅ Seçilen resmi editöre ekleme
   const handleInsertImage = () => {
      if (selectedImage) {
         editor.chain().focus().setImage({ src: selectedImage }).run();
         onImageGalleryOpenChange(false);
         setSelectedImage(null);
      }
   };

   // ✅ Gallery dialog kapatıldığında selectedImage'i temizle
   const handleGalleryClose = (open: boolean) => {
      onImageGalleryOpenChange(open);
      if (!open) {
         setSelectedImage(null);
      }
   };

   if (!editor) return null;

   return (
      <>
         {/* Main Selector */}
         <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
               <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-none"
                  title={'ADD_IMAGE'}
               >
                  <ImagePlus className="h-4 w-4" />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2" align="start" sideOffset={8}>
               <div className="space-y-1">
                  {/* Upload */}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleUpload}
                     className="w-full justify-start gap-2 h-9"
                  >
                     <Upload className="h-4 w-4" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm">{'UPLOAD_IMAGE'}</span>
                        <span className="text-xs text-muted-foreground">Upload from device</span>
                     </div>
                  </Button>

                  {/* Gallery */}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleGallery}
                     className="w-full justify-start gap-2 h-9"
                  >
                     <Images className="h-4 w-4" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm">{'IMAGE_GALLERY'}</span>
                        <span className="text-xs text-muted-foreground">Choose from gallery</span>
                     </div>
                  </Button>

                  {/* URL */}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        onOpenChange(false);
                        onImageUrlOpenChange(true);
                     }}
                     className="w-full justify-start gap-2 h-9"
                  >
                     <Link2 className="h-4 w-4" />
                     <div className="flex flex-col items-start">
                        <span className="text-sm">{'IMAGE_URL'}</span>
                        <span className="text-xs text-muted-foreground">Add from URL</span>
                     </div>
                  </Button>
               </div>
            </PopoverContent>
         </Popover>

         {/* Image URL Dialog */}
         <Dialog open={imageUrlOpen} onOpenChange={onImageUrlOpenChange}>
            <DialogContent className="sm:max-w-[360px]">
               <DialogHeader>
                  <DialogTitle>{'ADD_IMAGE_FROM_URL'}</DialogTitle>
                  <DialogDescription>{'ENTER_IMAGE_URL_DESCRIPTION'}</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 ">
                  <div className="items-center flex flex-row ">
                     <Label
                        htmlFor="imageUrl"
                        className={cn(
                           'text-sm font-medium',
                           !imageUrl.trim() && 'text-destructive',
                           'border h-7 px-2 rounded-l-md bg-accent'
                        )}
                     >
                        {'URL'}
                     </Label>
                     <Input
                        type="url"
                        id="imageUrl"
                        className={cn(
                           'col-span-3',
                           !imageUrl.trim() && 'border-destructive',
                           'h-7 rounded-l-none'
                        )}
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              handleImageUrl();
                           }
                        }}
                     />
                  </div>
               </div>
               <div className="flex justify-end gap-2">
                  <Button size={'sm'} variant="outline" onClick={() => onImageUrlOpenChange(false)}>
                     {'CANCEL'}
                  </Button>
                  <Button size={'sm'} onClick={handleImageUrl} disabled={!imageUrl.trim()}>
                     {'ADD_IMAGE'}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>

         {/* ✅ Real Image Gallery Dialog */}
         <Dialog open={imageGalleryOpen} onOpenChange={handleGalleryClose}>
            <DialogContent className="sm:max-w-[700px]">
               <DialogHeader>
                  <DialogTitle>{'SELECT_IMAGE_FROM_GALLERY'}</DialogTitle>
                  <DialogDescription>{'SELECT_IMAGE_FROM_GALLERY_DESCRIPTION'}</DialogDescription>
               </DialogHeader>
               <div className="py-4 max-h-[480px] overflow-y-auto">
                  {isGalleryLoading ? (
                     <div className="flex items-center justify-center h-40">
                        <Loader className="animate-spin" />
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imageGallery?.length > 0 ? (
                           imageGallery.map((album: ImageGallerySchema) => {
                              if (!album?.url) return null; // URL yoksa geç
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
                  <Button variant="outline" onClick={() => handleGalleryClose(false)}>
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
};
