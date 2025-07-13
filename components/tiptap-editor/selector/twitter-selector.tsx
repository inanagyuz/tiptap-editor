/**
 * @module TwitterSelector
 *
 * This module provides the TwitterSelector React component for embedding Twitter/X posts in the Tiptap editor.
 * It allows users to add, preview, and remove Twitter/X posts by entering a valid tweet URL.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Validates Twitter/X URLs before embedding.
 * - Supports both twitter.com and x.com formats.
 * - Provides a dialog for manual tweet insertion.
 * - Allows removing embedded tweets from the editor.
 * - Uses TwitterIcon for UI representation.
 *
 * @example
 * ```tsx
 * <TwitterSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */

'use client';

import React from 'react';
import { type Editor } from '@tiptap/react';
import { Twitter as TwitterIcon, CornerDownLeft, ExternalLink, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createRoot } from 'react-dom/client';
import { isValidTwitterUrl } from '../extensions/twitter';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { i18n } from '../i18n';

const twitterRegex =
   /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/;

export interface TwitterHandlerProps {
   editor: Editor | null | undefined;
   onSetTweet?: () => void;
   onTweetActive?: () => void;
}

export interface TwitterMainProps {
   url: string;
   setUrl: React.Dispatch<React.SetStateAction<string>>;
   setTweet: () => void;
   removeTweet: () => void;
   isActive: boolean;
}

export const useTwitterHandler = (props: TwitterHandlerProps) => {
   const { editor, onSetTweet, onTweetActive } = props;
   const [url, setUrl] = React.useState<string>('');

   React.useEffect(() => {
      if (!editor) return;

      const { src } = editor.getAttributes('twitter');

      if (editor.isActive('twitter') && !url) {
         setUrl(src || '');
         onTweetActive?.();
      }
   }, [editor, onTweetActive, url]);

   React.useEffect(() => {
      if (!editor) return;

      const updateTwitterState = () => {
         const { src } = editor.getAttributes('twitter');
         setUrl(src || '');

         if (editor.isActive('twitter') && !url) {
            onTweetActive?.();
         }
      };

      editor.on('selectionUpdate', updateTwitterState);
      return () => {
         editor.off('selectionUpdate', updateTwitterState);
      };
   }, [editor, onTweetActive, url]);

   const setTweet = React.useCallback(() => {
      if (!url || !editor) return;

      if (twitterRegex.test(url)) {
         try {
            // ✅ İlk önce extension komutunu dene
            if (editor.commands.setTweet) {
               editor.commands.setTweet({
                  src: url,
               });
            } else {
               editor
                  .chain()
                  .focus()
                  .insertContent({
                     type: 'twitter',
                     attrs: {
                        src: url,
                     },
                  })
                  .run();
            }

            onSetTweet?.();
         } catch (error) {
            console.error('❌ Tweet ekleme hatası:', error);
         }
      } else {
         console.error('❌ Geçersiz Twitter URL');
      }
   }, [editor, onSetTweet, url]);

   const removeTweet = React.useCallback(() => {
      if (!editor) return;
      editor.chain().focus().deleteSelection().run();
      setUrl('');
   }, [editor]);

   return {
      url,
      setUrl,
      setTweet,
      removeTweet,
      isActive: editor?.isActive('twitter') || false,
   };
};

const TwitterMain: React.FC<TwitterMainProps> = ({
   url,
   setUrl,
   setTweet,
   removeTweet,
   isActive,
}) => {
   const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
         event.preventDefault();
         setTweet();
      }
   };

   const urlValid = url.length === 0 || twitterRegex.test(url);

   console.log('invalid', urlValid);

   return (
      <div className="w-full">
         <div className="flex flex-row items-center">
            <Input
               id="twitter-url"
               type="url"
               placeholder={i18n.t('TWITTER_URL_PLACEHOLDER')}
               value={url}
               onChange={(e) => setUrl(e.target.value)}
               onKeyDown={handleKeyDown}
               className={cn(
                  'flex-1',
                  'rounded-md',
                  'h-8',
                  {
                     'border-red-500': !urlValid && url.length > 0,
                  },
                  'border-0 focus:ring-0 focus:border-0 rounded-r-none hover:border-0 focus-visible:ring-0',
                  'focus-visible:ring-0 focus-visible:border-0',
                  'focus-visible:ring-offset-0 focus-visible:ring-transparent'
               )}
            />

            {/* Add Tweet Button */}
            <Button
               size="sm"
               variant="outline"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setTweet();
               }}
               disabled={!url || !urlValid}
               className={cn('h-8 border-none rounded-none')}
               type="button"
            >
               <CornerDownLeft className="h-3 w-3" />
            </Button>

            <Separator orientation="vertical" className="h-5" />

            <Button
               size="sm"
               variant="outline"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(url, '_blank');
               }}
               title={i18n.t('TWITTER_OPEN_NEW_TAB')}
               type="button"
               className={cn('h-8 border-none rounded-none')}
               disabled={!isActive || !urlValid}
            >
               <ExternalLink className="h-3 w-3" />
            </Button>

            <Separator orientation="vertical" className="h-5" />

            <Button
               size="sm"
               variant="outline"
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeTweet();
               }}
               disabled={!url || !urlValid}
               title={i18n.t('TWITTER_REMOVE_BUTTON')}
               className={cn(
                  'h-8 border-none',
                  'text-red-500 hover:text-red-700 rounded-r-2xl rounded-l-none'
               )}
               type="button"
            >
               <Trash className="h-3 w-3" />
            </Button>
         </div>

         {!urlValid && url.length > 0 && (
            <div className="mt-2">
               <p className="text-xs text-red-500 px-2">{i18n.t('TWITTER_INVALID_URL')}</p>
            </div>
         )}
      </div>
   );
};

export interface TwitterSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const TwitterSelector = ({ editor, open, onOpenChange }: TwitterSelectorProps) => {
   const onSetTweet = () => onOpenChange(false);

   const twitterHandler = useTwitterHandler({
      editor: editor,
      onSetTweet,
   });

   if (!editor || !editor.isEditable) return null;

   return (
      <Popover open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button
               size="sm"
               variant="ghost"
               className="h-8 w-8 p-0 rounded-none"
               title={i18n.t('TWITTER_ADD_POST')}
               onClick={() => onOpenChange(!open)}
               type="button"
            >
               <TwitterIcon className="h-4 w-4" />
               <span className="sr-only">{i18n.t('TWITTER_ADD_BUTTON')}</span>
            </Button>
         </PopoverTrigger>

         <PopoverContent
            align="start"
            side="bottom"
            sideOffset={8}
            className={cn('w-80 p-0 rounded-2xl')}
         >
            <TwitterMain {...twitterHandler} />
         </PopoverContent>
      </Popover>
   );
};

export const twitterCommand = ({ editor }: { editor: Editor }) => {
   try {
      editor.commands.blur();
      const container = document.createElement('div');
      document.body.appendChild(container);

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

      const DialogComponent = () => {
         const [open, setOpen] = React.useState(true);
         const [url, setUrl] = React.useState('');
         const [isValidating, setIsValidating] = React.useState(false);

         // ✅ URL validasyon kontrolü eklendi
         const isUrlValid = url.length === 0 || isValidTwitterUrl(url);

         const handleClose = () => {
            setOpen(false);
            setTimeout(cleanup, 100);
         };

         const handleAddTweet = () => {
            if (!url) return;

            try {
               // ✅ Daha detaylı validasyon
               if (!isValidTwitterUrl(url)) {
                  setIsValidating(true);
                  return;
               }

               editor.commands.setTweet({
                  src: url,
               });

               handleClose();
            } catch (error) {
               console.error('Error adding Twitter/X post:', error);
            }
         };

         return (
            <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="w-96 p-6">
                  <DialogHeader>
                     <DialogTitle className="flex items-center gap-2 text-lg">
                        <TwitterIcon className="w-5 h-5 text-blue-500" />
                        {i18n.t('TWITTER_ADD_POST')}
                     </DialogTitle>
                     <DialogDescription className="hidden">
                        {i18n.t('TWITTER_DIALOG_DESC')}
                     </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="twitter-url" className="text-sm font-medium">
                           {i18n.t('TWITTER_URL_LABEL')}
                        </Label>
                        <Input
                           id="twitter-url"
                           type="url"
                           placeholder={i18n.t('TWITTER_URL_PLACEHOLDER')}
                           className={cn('w-full', {
                              'border-red-500': !isUrlValid && url.length > 0,
                           })}
                           value={url}
                           onChange={(e) => {
                              setUrl(e.target.value);
                              setIsValidating(false); // Reset validation error
                           }}
                           autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                           {i18n.t('TWITTER_URL_FORMATS')}
                        </p>
                        {/* ✅ Düzeltilmiş uyarı mesajı */}
                        {(!isUrlValid && url.length > 0) || isValidating ? (
                           <p className="text-xs text-red-500">{i18n.t('TWITTER_INVALID_URL')}</p>
                        ) : null}
                     </div>
                     <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm" onClick={handleClose}>
                           {i18n.t('TWITTER_CANCEL')}
                        </Button>
                        <Button
                           size="sm"
                           onClick={handleAddTweet}
                           disabled={!url || !isUrlValid}
                           className="bg-blue-500 hover:bg-blue-600"
                        >
                           {i18n.t('TWITTER_ADD_BUTTON')}
                        </Button>
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         );
      };

      root.render(<DialogComponent />);
   } catch (error) {
      console.error('Twitter command error:', error);
   }
};
