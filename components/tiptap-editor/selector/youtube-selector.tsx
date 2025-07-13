/**
 * @module YoutubeSelector
 *
 * This module provides the YoutubeSelector React component for embedding YouTube videos in the Tiptap editor.
 * It allows users to add, update, and remove YouTube videos by entering a valid video URL and specifying dimensions.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Validates YouTube URLs before embedding.
 * - Supports custom width and height for the video embed.
 * - Provides a dialog for manual video insertion.
 * - Allows removing embedded videos from the editor.
 * - Uses Youtube icon for UI representation.
 *
 * @example
 * ```tsx
 * <YoutubeSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { Youtube, CornerDownLeft, ExternalLink, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '../tiptap-utils';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { i18n } from '../i18n';

const youtubePattern =
   /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

export interface YoutubeHandlerProps {
   editor: Editor | null | undefined;
   onSetVideo?: () => void;
   onVideoActive?: () => void;
}

export interface YoutubeMainProps {
   url: string;
   setUrl: React.Dispatch<React.SetStateAction<string>>;
   width: string;
   setWidth: React.Dispatch<React.SetStateAction<string>>;
   height: string;
   setHeight: React.Dispatch<React.SetStateAction<string>>;
   setVideo: () => void;
   removeVideo: () => void;
   isActive: boolean;
}

export const useYoutubeHandler = (props: YoutubeHandlerProps) => {
   const { editor, onSetVideo, onVideoActive } = props;
   const [url, setUrl] = React.useState<string>('');
   const [width, setWidth] = React.useState<string>('640');
   const [height, setHeight] = React.useState<string>('480');

   React.useEffect(() => {
      if (!editor) return;

      const { src, width: w, height: h } = editor.getAttributes('youtube');

      if (editor.isActive('youtube') && !url) {
         setUrl(src || '');
         setWidth(w?.toString() || '640');
         setHeight(h?.toString() || '480');
         onVideoActive?.();
      }
   }, [editor, onVideoActive, url]);

   React.useEffect(() => {
      if (!editor) return;

      const updateYoutubeState = () => {
         const { src, width: w, height: h } = editor.getAttributes('youtube');
         setUrl(src || '');
         setWidth(w?.toString() || '640');
         setHeight(h?.toString() || '480');

         if (editor.isActive('youtube') && !url) {
            onVideoActive?.();
         }
      };

      editor.on('selectionUpdate', updateYoutubeState);
      return () => {
         editor.off('selectionUpdate', updateYoutubeState);
      };
   }, [editor, onVideoActive, url]);

   const setVideo = React.useCallback(() => {
      if (!url || !editor) return;

      // ✅ Basit YouTube ID çıkarma
      const getYouTubeId = (url: string) => {
         const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
         const match = url.match(regExp);
         return match && match[2].length === 11 ? match[2] : null;
      };

      const videoId = getYouTubeId(url);

      if (videoId) {
         const widthValue = parseInt(width, 10) || 640;
         const heightValue = parseInt(height, 10) || 480;

         try {
            // ✅ İlk önce extension komutunu dene
            if (editor.commands.setYoutubeVideo) {
               editor.commands.setYoutubeVideo({
                  src: url,
                  width: widthValue,
                  height: heightValue,
               });
            } else {
               editor
                  .chain()
                  .focus()
                  .insertContent({
                     type: 'youtube',
                     attrs: {
                        src: url,
                        width: widthValue,
                        height: heightValue,
                     },
                  })
                  .run();
            }

            onSetVideo?.();
         } catch (error) {
            console.error('❌ Video ekleme hatası:', error);
         }
      } else {
         console.error('❌ Geçersiz YouTube URL');
      }
   }, [editor, onSetVideo, url, width, height]);

   const removeVideo = React.useCallback(() => {
      if (!editor) return;
      editor.chain().focus().deleteSelection().run();
      setUrl('');
      setWidth('640');
      setHeight('480');
   }, [editor]);

   return {
      url,
      setUrl,
      width,
      setWidth,
      height,
      setHeight,
      setVideo,
      removeVideo,
      isActive: editor?.isActive('youtube') || false,
   };
};

const YoutubeMain: React.FC<YoutubeMainProps> = ({
   url,
   setUrl,
   width,
   setWidth,
   height,
   setHeight,
   setVideo,
   removeVideo,
   isActive,
}) => {
   const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
         event.preventDefault();
         setVideo();
      }
   };

   const isValidUrl = React.useMemo(() => {
      if (url.length === 0) return true; // Boş URL geçerli
      return youtubePattern.test(url);
   }, [url]);

   return (
      <div className="space-y-3 w-full">
         {/* URL Input */}
         <div className="space-y-2">
            <Input
               id="youtube-url"
               type="url"
               placeholder={i18n.t('YOUTUBE_URL_PLACEHOLDER')}
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               onKeyDown={handleKeyDown}
               className={cn(
                  'w-full',
                  {
                     'border-red-500': !isValidUrl && url.length > 0,
                  },
                  'h-7'
               )}
            />
            {!isValidUrl && url.length > 0 && (
               <p className="text-xs text-red-500">{i18n.t('YOUTUBE_INVALID_URL')}</p>
            )}
         </div>

         {/* Dimensions */}

         <div className="flex flex-row items-center gap-2">
            <Label htmlFor="youtube-width" className="text-sm font-medium basis-1/4 h-7">
               {'WIDTH'}
            </Label>
            <Input
               id="youtube-width"
               type="number"
               placeholder="640"
               value={width}
               onChange={(e) => setWidth(e.target.value)}
               className={cn('basis-1/4 h-7', {
                  'border-red-500': parseInt(height, 10) < 320 && height.length > 0,
               })}
            />

            <Label htmlFor="youtube-height" className="text-sm font-medium basis-1/4 h-7">
               {'HEIGHT'}
            </Label>
            <Input
               id="youtube-height"
               type="number"
               placeholder="480"
               value={height}
               onChange={(e) => setHeight(e.target.value)}
               className={cn('basis-1/4 h-7', {
                  'border-red-500': parseInt(height, 10) < 180 && height.length > 0,
               })}
            />
         </div>

         {/* Action Buttons */}
         <div className="flex items-center gap-2">
            {/* ✅ Add Video Button */}
            <Button
               size="sm"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideo();
               }}
               disabled={!url || !isValidUrl}
               className="flex-1 gap-2"
               type="button"
            >
               <CornerDownLeft className="h-3 w-3" />
               {isActive ? i18n.t('YOUTUBE_UPDATE_VIDEO') : i18n.t('YOUTUBE_ADD_VIDEO')}
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* External Link */}
            {url && (
               <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     window.open(url, '_blank');
                  }}
                  title="Open in new tab"
                  type="button"
               >
                  <ExternalLink className="h-3 w-3" />
                  <span className="sr-only">{i18n.t('NEW_TAB')}</span>
               </Button>
            )}

            {/* Remove Video */}
            {isActive && (
               <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     removeVideo();
                  }}
                  title="Remove video"
                  className="text-red-500 hover:text-red-700"
                  type="button"
               >
                  <Trash className="h-3 w-3" />
                  <span className="sr-only">{i18n.t('YOUTUBE_REMOVE_VIDEO')}</span>
               </Button>
            )}
         </div>
      </div>
   );
};

export interface YoutubeSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const YoutubeSelector = ({ editor, open, onOpenChange }: YoutubeSelectorProps) => {
   const onSetVideo = () => onOpenChange(false);

   const youtubeHandler = useYoutubeHandler({
      editor: editor,
      onSetVideo,
   });

   if (!editor || !editor.isEditable) return null;

   return (
      <Popover open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button
               size="sm"
               variant="ghost"
               className="h-8 w-8 p-0 rounded-none"
               title={i18n.t('YOUTUBE_ADD_VIDEO')}
               onClick={() => onOpenChange(!open)}
               type="button"
            >
               <Youtube className="h-4 w-4" />
               <span className="sr-only">{i18n.t('YOUTUBE_ADD_VIDEO')}</span>
            </Button>
         </PopoverTrigger>

         <PopoverContent align="start" side="bottom" sideOffset={8} className={cn('w-80 p-2 ')}>
            <YoutubeMain {...youtubeHandler} />
         </PopoverContent>
      </Popover>
   );
};

export // YouTube Command Function
const youtubeCommand = ({ editor }: { editor: Editor }) => {
   try {
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

      // Create QueryClient instance for this dialog
      const queryClient = new QueryClient({
         defaultOptions: {
            queries: {
               staleTime: 60 * 1000,
            },
         },
      });

      // Create the dialog component
      const DialogComponent = () => {
         const [open, setOpen] = React.useState(true);
         const [url, setUrl] = React.useState('');
         const [width, setWidth] = React.useState('640');
         const [height, setHeight] = React.useState('480');
         const [isValidating, setIsValidating] = React.useState(false);

         const isValidUrl = React.useMemo(() => {
            if (url.length === 0) return true; // Boş URL geçerli
            return youtubePattern.test(url);
         }, [url]);

         const handleClose = () => {
            setOpen(false);
            // Clean up the container after dialog closes
            setTimeout(cleanup, 100);
         };

         const handleAddVideo = () => {
            if (!url) return;
            if (!isValidUrl) {
               setIsValidating(true);
               return;
            }

            try {
               // Extract video ID from URL
               const videoId = extractYouTubeVideoId(url);
               if (!videoId) {
                  setIsValidating(true);
                  return;
               }

               // Insert YouTube embed into editor using the correct command
               editor
                  .chain()
                  .focus()
                  .setYoutubeVideo({
                     src: url,
                     width: parseInt(width) || 640,
                     height: parseInt(height) || 480,
                  })
                  .run();

               handleClose();
            } catch (error) {
               console.error('Error adding YouTube video:', error);
            }
         };

         const extractYouTubeVideoId = (url: string) => {
            const match = url.match(youtubePattern);
            return match ? match[1] : null;
         };

         return (
            <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="w-80 p-4 text-sm">
                  <DialogHeader>
                     <DialogTitle>{i18n.t('YOUTUBE_ADD_VIDEO')} </DialogTitle>
                     <DialogDescription className="hidden">
                        {i18n.t('YOUTUBE_ADD_VIDEO')}
                     </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Input
                           id="youtube-url"
                           type="url"
                           placeholder={i18n.t('YOUTUBE_URL_PLACEHOLDER')}
                           className={cn('w-full px-3 py-2 border rounded-md h-7', {
                              'border-red-500': !isValidUrl && url.length > 0,
                           })}
                           value={url}
                           onChange={(e) => {
                              setUrl(e.target.value);
                              setIsValidating(false);
                           }}
                        />

                        {(!isValidUrl && url.length > 0) || isValidating ? (
                           <p className="text-xs text-red-500">{i18n.t('YOUTUBE_INVALID_URL')}</p>
                        ) : null}
                     </div>

                     <div className="grid grid-cols-2 gap-2">
                        <div>
                           <Label htmlFor="youtube-width" className="text-sm font-medium">
                              {i18n.t('WIDTH')}
                           </Label>
                           <Input
                              id="youtube-width"
                              type="number"
                              placeholder="640"
                              className="h-7"
                              value={width}
                              onChange={(e) => setWidth(e.target.value)}
                           />
                        </div>
                        <div>
                           <Label htmlFor="youtube-height" className="text-sm font-medium">
                              {i18n.t('HEIGHT')}
                           </Label>
                           <Input
                              id="youtube-height"
                              type="number"
                              placeholder="480"
                              className="h-7"
                              value={height}
                              onChange={(e) => setHeight(e.target.value)}
                           />
                        </div>
                     </div>
                     <div className="flex justify-end space-x-2">
                        <Button
                           variant={'outline'}
                           size={'sm'}
                           onClick={handleClose}
                           className="h-7"
                        >
                           {i18n.t('CANCEL')}
                        </Button>
                        <Button
                           variant={'outline'}
                           size={'sm'}
                           onClick={handleAddVideo}
                           disabled={!url || !isValidUrl}
                           className="h-7"
                        >
                           {i18n.t('YOUTUBE_ADD_VIDEO')}
                        </Button>
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         );
      };

      // Render the dialog with QueryClient provider
      root.render(
         <QueryClientProvider client={queryClient}>
            <DialogComponent />
         </QueryClientProvider>
      );
   } catch (error) {
      console.error('YouTube command error:', error);
   }
};


