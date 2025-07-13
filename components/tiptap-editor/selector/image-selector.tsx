'use client';

/**
 * @module ImageSelector
 *
 * This module provides the ImageSelector React component for selecting, uploading, and inserting images into the Tiptap editor.
 * It supports uploading from device, choosing from gallery, and adding images via URL.
 * All UI strings are localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with image gallery API for fetching and displaying images.
 * - Allows users to upload images, select from gallery, or insert via URL.
 * - Includes dialogs for gallery and URL selection.
 * - Provides command functions for opening gallery and URL dialogs programmatically.
 * - Uses AlbumArtwork for image previews and supports selection highlighting.
 *
 * @example
 * ```tsx
 * <ImageSelector editor={editor} open={open} onOpenChange={setOpen} ... />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the main selector popover is open.
 * @property onOpenChange - Callback fired when the popover is opened or closed.
 * @property imageGalleryOpen - Whether the gallery dialog is open.
 * @property onImageGalleryOpenChange - Callback fired when the gallery dialog is opened or closed.
 * @property imageUrlOpen - Whether the image URL dialog is open.
 * @property onImageUrlOpenChange - Callback fired when the image URL dialog is opened or closed.
 */

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
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ImageUrl, ImageGalleryDialog } from '../image-upload';
import { i18n } from '../i18n';

interface ImageSelectorProps {
   editor: Editor;
   showImageUrl?: boolean;
   showImageUpload?: boolean;
   showImageGallery?: boolean;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   // Gallery props
   imageGalleryOpen: boolean;
   onImageGalleryOpenChange: (open: boolean) => void;
   // URL props
   imageUrlOpen: boolean;
   onImageUrlOpenChange: (open: boolean) => void;
}

/**
 * ImageSelector component for selecting, uploading, and inserting images into the editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param showImageUrl - Whether to show the image URL dialog.
 * @param showImageUpload - Whether to show the image upload dialog.
 * @param showImageGallery - Whether to show the image gallery.
 * @param open - Whether the main selector popover is open.
 * @param onOpenChange - Callback fired when the popover is opened or closed.
 * @param imageGalleryOpen - Whether the gallery dialog is open.
 * @param onImageGalleryOpenChange - Callback fired when the gallery dialog is opened or closed.
 * @param imageUrlOpen - Whether the image URL dialog is open.
 * @param onImageUrlOpenChange - Callback fired when the image URL dialog is opened or closed.
 */

export const ImageSelector = ({
   editor,
   showImageUrl,
   showImageUpload,
   showImageGallery,
   open,
   onOpenChange,
   imageGalleryOpen,
   onImageGalleryOpenChange,
   imageUrlOpen,
   onImageUrlOpenChange,
}: ImageSelectorProps) => {
   const [imageUrl, setImageUrl] = useState('');
   const [selectedImage, setSelectedImage] = useState<string | null>(null);
   const [isValidating, setIsValidating] = useState(false);

   // ✅ Gallery API Query
   const { data: galleryData, isLoading: isGalleryLoading } = useQuery({
      queryKey: ['imageGallery'],
      queryFn: async () => {
         const galleryUrl = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
         if (!galleryUrl) {
            throw new Error(i18n.t('API_NOT_CONFIGURED'));
         }
         const response = await fetch(galleryUrl, {
            method: 'GET',
         });
         if (!response.ok) throw new Error(i18n.t('NO_DATA'));
         const { data, status } = await response.json();
         if (status !== 200) throw new Error(i18n.t('NO_DATA'));
         return data;
      },
      enabled: imageGalleryOpen,
      retry: 1,
   });

   const isValidImageUrl = (url: string) => {
      if (url.length === 0) return true; // Boş URL geçerli
      const urlPattern =
         /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return urlPattern.test(url);
   };

   const imageGallery = galleryData as ImageGallerySchema[] | [];

   // Upload işlemi
   const handleUpload = () => {
      editor
         .chain()
         .focus()
         .setImageUploadNode({
            accept: 'image/*',
            limit: 1,
            maxSize: 5 * 1024 * 1024,
         })
         .run();
      onOpenChange(false);
   };

   const handleImageUrl = () => {
      if (!isValidImageUrl(imageUrl)) {
         setIsValidating(true);
         return;
      }
      if (imageUrl && imageUrl.trim()) {
         editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
         setImageUrl('');
         onImageUrlOpenChange(false);
      }
   };

   const handleGallery = () => {
      onOpenChange(false);
      onImageGalleryOpenChange(true);
   };

   const handleSelectImage = (url: string) => {
      setSelectedImage(url);
   };

   const handleInsertImage = () => {
      if (selectedImage) {
         editor.chain().focus().setImage({ src: selectedImage }).run();
         onImageGalleryOpenChange(false);
         setSelectedImage(null);
      }
   };

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
                  title={i18n.t('ADD_IMAGE')}
               >
                  <ImagePlus className="h-4 w-4" />
               </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2" align="start" sideOffset={8}>
               <div className="space-y-1">
                  {/* Upload */}
                  {showImageUpload && (
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUpload}
                        className="w-full justify-start gap-2 h-9"
                     >
                        <Upload className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                           <span className="text-sm">{i18n.t('UPLOAD_IMAGE')}</span>
                           <span className="text-xs text-muted-foreground">
                              {i18n.t('UPLOAD_FROM_DEVICE')}
                           </span>
                        </div>
                     </Button>
                  )}

                  {/* Gallery */}
                  {showImageGallery && (
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGallery}
                        className="w-full justify-start gap-2 h-9"
                     >
                        <Images className="h-4 w-4" />
                        <div className="flex flex-col items-start">
                           <span className="text-sm">{i18n.t('IMAGE_GALLERY')}</span>
                           <span className="text-xs text-muted-foreground">
                              {i18n.t('CHOOSE_FROM_GALLERY')}
                           </span>
                        </div>
                     </Button>
                  )}

                  {/* URL */}
                  {showImageUrl && (
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
                           <span className="text-sm">{i18n.t('IMAGE_URL')}</span>
                           <span className="text-xs text-muted-foreground">
                              {i18n.t('ADD_FROM_URL')}
                           </span>
                        </div>
                     </Button>
                  )}
               </div>
            </PopoverContent>
         </Popover>

         {/* Image URL Dialog */}
         <Dialog open={imageUrlOpen} onOpenChange={onImageUrlOpenChange}>
            <DialogContent className="sm:max-w-[360px]">
               <DialogHeader>
                  <DialogTitle>{i18n.t('SELECT_IMAGE_FROM_GALLERY')}</DialogTitle>
                  <DialogDescription>
                     {i18n.t('SELECT_IMAGE_FROM_GALLERY_DESCRIPTION')}
                  </DialogDescription>
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
                              setIsValidating(false);
                           }
                        }}
                     />
                  </div>
                  {isValidating ? (
                     <p className="text-xs text-red-500 mt-1 px-2">
                        {!imageUrl ? i18n.t('URL_REQUIRED') : i18n.t('INVALID_IMAGE_URL')}
                     </p>
                  ) : null}
               </div>
               <div className="flex justify-end gap-2">
                  <Button size={'sm'} variant="outline" onClick={() => onImageUrlOpenChange(false)}>
                     {i18n.t('CANCEL')}
                  </Button>
                  <Button size={'sm'} onClick={handleImageUrl} disabled={!imageUrl.trim()}>
                     {i18n.t('INSERT')}
                  </Button>
               </div>
            </DialogContent>
         </Dialog>

         {/* ✅ Real Image Gallery Dialog */}
         <Dialog open={imageGalleryOpen} onOpenChange={handleGalleryClose}>
            <DialogContent className="sm:max-w-[700px]">
               <DialogHeader>
                  <DialogTitle>{i18n.t('SELECT_IMAGE_FROM_GALLERY')}</DialogTitle>
                  <DialogDescription>
                     {i18n.t('SELECT_IMAGE_FROM_GALLERY_DESCRIPTION')}
                  </DialogDescription>
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
                              {i18n.t('NO_IMAGES')}
                           </div>
                        )}
                     </div>
                  )}
               </div>

               <DialogFooter>
                  <Button variant="outline" onClick={() => handleGalleryClose(false)}>
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
};

/**
 * Command function for opening the image upload dialog.
 *
 * @param editor - The Tiptap editor instance.
 */
export const imageCommand = ({ editor }: { editor: Editor }) => {
   try {
      editor.commands.blur();
      editor
         .chain()
         .focus()
         .setImageUploadNode({
            accept: 'image/*',
            limit: 1,
            maxSize: 5 * 1024 * 1024, // 5MB
         })
         .run();
   } catch (error) {
      console.error('Image command error:', error);
   }
};

/**
 * Command function for opening the image gallery dialog.
 *
 * @param editor - The Tiptap editor instance.
 */
export const imageGalleryCommand = ({ editor }: { editor: Editor }) => {
   // Create a container for the dialog
   const container = document.createElement('div');
   document.body.appendChild(container);

   // Create a QueryClient for the dialog
   const queryClient = new QueryClient();

   // Create root and cleanup function
   const root = createRoot(container);

   const cleanup = () => {
      try {
         root.unmount();
         if (document.body.contains(container)) {
            document.body.removeChild(container);
         }
      } catch (error) {
         console.error('Cleanup error:', error);
      }
   };

   // Create the dialog component
   const DialogComponent = () => {
      const [open, setOpen] = React.useState(true);

      const handleClose = () => {
         setOpen(false);
         // Clean up the container after dialog closes
         setTimeout(cleanup, 100);
      };

      return (
         <QueryClientProvider client={queryClient}>
            <ImageGalleryDialog open={open} onOpenChange={handleClose} editor={editor} />
         </QueryClientProvider>
      );
   };

   // Render the dialog
   root.render(<DialogComponent />);
};

/**
 * Command function for opening the image URL dialog.
 *
 * @param editor - The Tiptap editor instance.
 */
export const imageUrlCommand = ({ editor }: { editor: Editor }) => {
   // Create a container for the dialog
   const container = document.createElement('div');
   document.body.appendChild(container);

   // Create root and cleanup function
   const root = createRoot(container);

   const cleanup = () => {
      try {
         root.unmount();
         if (document.body.contains(container)) {
            document.body.removeChild(container);
         }
      } catch (error) {
         console.error('Cleanup error:', error);
      }
   };

   // Create the dialog component
   const DialogComponent = () => {
      const [open, setOpen] = React.useState(true);

      const handleClose = () => {
         setOpen(false);
         // Clean up the container after dialog closes
         setTimeout(cleanup, 100);
      };

      return <ImageUrl open={open} onOpenChange={handleClose} editor={editor} />;
   };

   // Render the dialog
   root.render(<DialogComponent />);
};
