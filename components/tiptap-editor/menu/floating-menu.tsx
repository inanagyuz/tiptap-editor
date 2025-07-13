/**
 * @module FooMenuSelector
 *
 * This component provides the floating menu for the Tiptap editor.
 * It displays formatting, alignment, font, color, link, and image selectors when the user types "/" in the editor.
 * Also includes a ContextAI button for AI-powered content generation.
 *
 * @remarks
 * - Uses Tiptap's FloatingMenu extension for contextual toolbars.
 * - Shows selectors for text formatting, alignment, font size, line height, undo/redo, link, color, font family, and image.
 * - The menu is shown only when the text before the cursor ends with "/".
 * - Includes popover for AI context actions.
 *
 * @example
 * ```tsx
 * <FooMenuSelector editor={editor} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 */

import * as React from 'react';
import { FloatingMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import {
   useSelectors,
   Selector,
   AlignmentSelector,
   FontFamilySelector,
   FontSizeSelector,
   ColorSelector,
   LineHeightSelector,
   UndoRedoSelector,
   LinkSelector,
   ImageSelector,
} from '../selector';
import { ContextAI } from '../extensions/context-ai';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Brain } from 'lucide-react';
import { i18n } from '../i18n';
/**
 * FooMenuSelector component renders the floating menu toolbar for the editor.
 *
 * @param editor - The Tiptap editor instance.
 */
export const FooMenuSelector = ({ editor }: { editor: Editor }) => {
   const selectors = useSelectors();
   const [openContextAI, setOpenContextAI] = React.useState(false);
   const handleContextAIOpenChange = React.useCallback((open: boolean) => {
      setOpenContextAI(open);
   }, []);

   const handleContextAIButtonClick = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenContextAI(true);
   }, []);
   return (
      <FloatingMenu
         editor={editor}
         shouldShow={({ editor }) => {
            const { state } = editor;
            const { $from } = state.selection;
            const textBefore = $from.nodeBefore?.text || '';
            return textBefore.endsWith('/');
         }}
         className="floating-menu flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
      >
         <div className="flex flex-col p-1">
            <div className="flex items-center gap-1 p-1 h-8 mb-1">
               <Selector editor={editor} {...selectors.selector} />
               <Separator orientation="vertical" />
               <AlignmentSelector editor={editor} {...selectors.alignment} />
               <Separator orientation="vertical" />
               <FontSizeSelector editor={editor} {...selectors.fontSize} />
               <Separator orientation="vertical" />
               <LineHeightSelector editor={editor} {...selectors.lineHeight} />
               <Separator orientation="vertical" />
               <UndoRedoSelector editor={editor} />
            </div>

            <div className="flex items-center gap-1 p-1 h-8 mb-1">
               <LinkSelector editor={editor} {...selectors.link} />
               <Separator orientation="vertical" />
               <ColorSelector editor={editor} {...selectors.color} />
               <Separator orientation="vertical" />
               <FontFamilySelector editor={editor} {...selectors.fontFamily} />
               <Separator orientation="vertical" />
               <ImageSelector editor={editor} {...selectors.image} />
            </div>
         </div>

         <div className="flex items-center border-l border-muted">
            <Popover open={openContextAI} onOpenChange={handleContextAIOpenChange} modal={true}>
               <PopoverTrigger asChild>
                  <Button
                     className="gap-1 rounded-none text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                     variant="ghost"
                     size="sm"
                     onClick={handleContextAIButtonClick}
                  >
                     <Brain className="h-4 w-4" />
                     {i18n.t('CONTEXT_AI')}
                  </Button>
               </PopoverTrigger>
               <PopoverContent
                  side="bottom"
                  align="end"
                  className="p-0 w-auto"
                  onInteractOutside={(e) => {
                     if (e.target instanceof Element && e.target.closest('[data-context-ai]')) {
                        e.preventDefault();
                     }
                  }}
               >
                  <div data-context-ai>
                     <ContextAI editor={editor} onOpenChange={handleContextAIOpenChange} />
                  </div>
               </PopoverContent>
            </Popover>
         </div>
      </FloatingMenu>
   );
};
