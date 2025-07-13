/**
 * @module AlbumArtwork
 *
 * This module provides the AlbumArtwork React component for displaying image gallery items with artwork, name, and actions.
 * It supports portrait and square aspect ratios, custom dimensions, and fallback rendering when no image is available.
 *
 * @remarks
 * - Displays image artwork using Next.js Image component.
 * - Shows album name or a localized fallback if not available.
 * - Includes edit and delete actions with modal dialogs.
 * - All UI strings should be localized via i18n for multi-language support.
 *
 * @example
 * ```tsx
 * <AlbumArtwork album={album} aspectRatio="portrait" width={200} height={300} />
 * ```
 *
 * @property album - The image gallery item to display.
 * @property aspectRatio - Aspect ratio of the artwork ('portrait' or 'square').
 * @property width - Width of the image.
 * @property height - Height of the image.
 * @property className - Custom CSS class for the container.
 */

import React from 'react';
import Image from 'next/image';
import { Ban, Edit, Trash } from 'lucide-react';
import { ImageGallerySchema } from '@/schemas/image-gallery';
import { cn } from '@/lib/utils';
import { FormPage } from './form';
import { Button } from '@/components/ui/button';
import { i18n } from '../i18n';

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
   album: ImageGallerySchema;
   aspectRatio?: 'portrait' | 'square';
   width?: number;
   height?: number;
}

/**
 * AlbumArtwork component displays an image gallery item with artwork, name, and actions.
 *
 * @param album - The image gallery item to display.
 * @param aspectRatio - Aspect ratio of the artwork ('portrait' or 'square').
 * @param width - Width of the image.
 * @param height - Height of the image.
 * @param className - Custom CSS class for the container.
 */

export function AlbumArtwork({
   album,
   aspectRatio = 'portrait',
   width,
   height,
   className,
   ...props
}: AlbumArtworkProps) {
   const isValidUrl = (url: string) => {
      try {
         new URL(url);
         return true;
      } catch {
         return false;
      }
   };

   // Tam URL oluştur
   const imageUrl = album?.url && isValidUrl(album.url) ? album.url : null;

   return (
      <div className={cn(className)} {...props}>
         <div className="overflow-hidden rounded-t-md">
            {imageUrl ? (
               <>
                  <Image
                     src={imageUrl}
                     alt={album?.fileName || 'hesapyap.net'}
                     width={width}
                     height={height}
                     layout="responsive"
                     className={cn(
                        'object-cover transition-all hover:scale-105 w-full h-full',
                        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
                     )}
                  />
               </>
            ) : (
               <Ban className="h-full w-full rounded-md bg-muted" />
            )}
         </div>
         <div className="flex flex-row justify-between items-center p-2 bg-muted/50 rounded-b-md">
            <span className="text-sm truncate flex flex-row items-center">
               {album?.name || i18n.t('NO_NAME')}
            </span>
            <div className="flex flex-row items-center">
               <Action data={album} />
            </div>
         </div>
      </div>
   );
}

/**
 * Props for the Action component.
 *
 * @property data - The image gallery item for actions.
 */
interface ActionProps {
   data: ImageGallerySchema;
}

/**
 * Action component provides edit and delete actions for an image gallery item.
 *
 * @param data - The image gallery item for actions.
 */

export function Action({ data }: ActionProps) {
   const [openDrawer, setOpenDrawer] = React.useState(false);
   const [openDelete, setOpenDelete] = React.useState(false);

   return (
      <>
         <div className="flex w-[80px] justify-end">
            <Button
               variant="ghost"
               size="icon"
               onClick={() => setOpenDrawer(true)}
               className="hover:bg-muted hover:text-primary transition-colors cursor-pointer"
            >
               <Edit className="w-4 h-4" />
            </Button>
            <Button
               variant="ghost"
               size="icon"
               onClick={() => setOpenDelete(true)}
               className="hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
            >
               <Trash className="w-4 h-4" />
            </Button>
         </div>

         {openDrawer && (
            <FormPage
               metod="PUT"
               data={data}
               onClose={() => setOpenDrawer(false)}
               open={openDrawer}
            />
         )}

         {openDelete && (
            <FormPage
               metod="DELETE"
               data={data}
               onClose={() => setOpenDelete(false)}
               open={openDelete}
            />
         )}
      </>
   );
}
