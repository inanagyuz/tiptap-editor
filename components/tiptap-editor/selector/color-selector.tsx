'use client';

/**
 * @module ColorSelector
 *
 * This module provides the ColorSelector React component for selecting text and highlight colors in the Tiptap editor.
 * It displays color options with preview, allows quick clearing, and supports both text and background highlight colors.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's setColor and setHighlight commands.
 * - Highlights the active color option.
 * - Supports quick clear actions for text and highlight colors.
 * - Uses BaseSelector for alternative rendering and optimization.
 *
 * @example
 * ```tsx
 * <ColorSelector editor={editor} open={open} onOpenChange={setOpen} />
 * <ColorSelectorWithBase editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */

import { ChevronDown, Palette, Trash, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Editor } from '@tiptap/react';
import { BaseSelector, type SelectorItem } from './base-selector';
import { i18n } from '../i18n';

export interface BubbleColorMenuItem {
   name: string;
   color: string;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
   {
      name: 'DEFAULT',
      color: 'var(--highlight-default)',
   },
   {
      name: 'PURPLE',
      color: '#9333EA',
   },
   {
      name: 'RED',
      color: '#E00000',
   },
   {
      name: 'YELLOW',
      color: '#EAB308',
   },
   {
      name: 'BLUE',
      color: '#2563EB',
   },
   {
      name: 'GREEN',
      color: '#008A00',
   },
   {
      name: 'ORANGE',
      color: '#FFA500',
   },
   {
      name: 'PINK',
      color: '#BA4081',
   },
   {
      name: 'GRAY',
      color: '#A8A29E',
   },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
   {
      name: 'DEFAULT',
      color: 'var(--highlight-default)',
   },
   {
      name: 'PURPLE',
      color: 'var(--highlight-purple)',
   },
   {
      name: 'RED',
      color: 'var(--highlight-red)',
   },
   {
      name: 'YELLOW',
      color: 'var(--highlight-yellow)',
   },
   {
      name: 'BLUE',
      color: 'var(--highlight-blue)',
   },
   {
      name: 'GREEN',
      color: 'var(--highlight-green)',
   },
   {
      name: 'ORANGE',
      color: 'var(--highlight-orange)',
   },
   {
      name: 'PINK',
      color: 'var(--highlight-pink)',
   },
   {
      name: 'GRAY',
      color: 'var(--highlight-gray)',
   },
];

interface ColorSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

/**
 * ColorSelector component for selecting text and highlight colors in the editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */

export const ColorSelector = ({ editor, open, onOpenChange }: ColorSelectorProps) => {
   if (!editor) return null;

   // ✅ Convert colors to SelectorItems
   const textColorItems: SelectorItem[] = TEXT_COLORS.map((colorItem) => ({
      name: `TEXT_COLOR_${colorItem.name}`,
      command: (editor) => {
         editor.commands.unsetColor();
         if (colorItem.name !== 'DEFAULT') {
            editor.chain().focus().setColor(colorItem.color).run();
         }
      },
      isActive: (editor) => {
         if (colorItem.name === 'DEFAULT') {
            return !editor.isActive('textStyle') || !editor.getAttributes('textStyle').color;
         }
         return editor.isActive('textStyle', { color: colorItem.color });
      },
      value: colorItem.name,
      description: `Set text color to ${colorItem.name.toLowerCase()}`,
   }));

   const highlightColorItems: SelectorItem[] = HIGHLIGHT_COLORS.map((colorItem) => ({
      name: `HIGHLIGHT_COLOR_${colorItem.name}`,
      command: (editor) => {
         editor.commands.unsetHighlight();
         if (colorItem.name !== 'DEFAULT') {
            editor.chain().focus().setHighlight({ color: colorItem.color }).run();
         }
      },
      isActive: (editor) => {
         if (colorItem.name === 'DEFAULT') {
            return !editor.isActive('highlight') || !editor.getAttributes('highlight').color;
         }
         return editor.isActive('highlight', { color: colorItem.color });
      },
      value: colorItem.name,
      description: `Set background color to ${colorItem.name.toLowerCase()}`,
   }));

   // ✅ Get active colors for trigger display
   const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive('textStyle', { color }));
   const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
      editor.isActive('highlight', { color })
   );

   return (
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button size="sm" className="gap-2 rounded-none" variant="ghost">
               <span
                  className="rounded-sm px-1 border"
                  style={{
                     color: activeColorItem?.color || 'currentColor',
                     backgroundColor: activeHighlightItem?.color || 'transparent',
                  }}
               >
                  A
               </span>
               <ChevronDown className="h-4 w-4" />
            </Button>
         </PopoverTrigger>

         <PopoverContent
            sideOffset={5}
            className="my-1 flex max-h-80 max-w-[160px] flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
            align="start"
         >
            {/* Text Colors Section */}
            <div className="flex flex-col">
               <div className="space-y-1">
                  {textColorItems.map((item) => {
                     const colorName = item.name.replace('TEXT_COLOR_', '');
                     const colorItem = TEXT_COLORS.find((c) => c.name === colorName);
                     const isActive = item.isActive(editor);

                     return (
                        <button
                           key={item.name}
                           onClick={() => {
                              item.command(editor);
                              onOpenChange(false);
                           }}
                           className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent rounded-sm w-full"
                        >
                           <div className="flex items-center gap-2">
                              <div
                                 className="rounded-sm border px-2 py-px font-medium"
                                 style={{ color: colorItem?.color }}
                              >
                                 A
                              </div>
                              <span>{i18n.t(colorName)}</span>
                           </div>
                           {isActive && <span className="text-blue-600 text-xs">●</span>}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Highlight Colors Section */}
            <div className="border-t pt-2 mt-2">
               <div className="space-y-1">
                  {highlightColorItems.map((item) => {
                     const colorName = item.name.replace('HIGHLIGHT_COLOR_', '');
                     const colorItem = HIGHLIGHT_COLORS.find((c) => c.name === colorName);
                     const isActive = item.isActive(editor);

                     return (
                        <button
                           key={item.name}
                           onClick={() => {
                              item.command(editor);
                              onOpenChange(false);
                           }}
                           className="flex cursor-pointer items-center justify-between px-2 py-1 text-sm hover:bg-accent rounded-sm w-full"
                        >
                           <div className="flex items-center gap-2">
                              <div
                                 className="rounded-sm border px-2 py-px font-medium"
                                 style={{ backgroundColor: colorItem?.color }}
                              >
                                 A
                              </div>
                              <span>{i18n.t(colorName)}</span>
                           </div>
                           {isActive && <span className="text-blue-600 text-xs">●</span>}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Quick Clear Actions */}
            <div className="border-t pt-2 mt-2">
               <div className="grid grid-cols-2 gap-1  px-2 items-center justify-around w-full">
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => {
                        editor.commands.unsetColor();
                        onOpenChange(false);
                     }}
                     className="h-6 w-8 text-xs"
                  >
                     <Trash className="h-3 w-3" />
                  </Button>
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={() => {
                        editor.commands.unsetHighlight();
                        onOpenChange(false);
                     }}
                     className="h-6 w-8 text-xs"
                  >
                     <Trash2 className="h-3 w-3" />
                  </Button>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
};

/**
 * ColorSelectorWithBase component for selecting colors using BaseSelector.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */
export const ColorSelectorWithBase = ({ editor, open, onOpenChange }: ColorSelectorProps) => {
   if (!editor) return null;

   // Sadece text color items (basit versiyon için)
   const colorItems: SelectorItem[] = [...TEXT_COLORS, ...HIGHLIGHT_COLORS].map(
      (colorItem, index) => {
         const isHighlight = index >= TEXT_COLORS.length;
         const prefix = isHighlight ? 'HIGHLIGHT_' : 'TEXT_';

         return {
            name: `${prefix}COLOR_${colorItem.name}`,
            icon: Palette,
            command: (editor) => {
               if (isHighlight) {
                  editor.commands.unsetHighlight();
                  if (colorItem.name !== 'DEFAULT') {
                     editor.chain().focus().setHighlight({ color: colorItem.color }).run();
                  }
               } else {
                  editor.commands.unsetColor();
                  if (colorItem.name !== 'DEFAULT') {
                     editor.chain().focus().setColor(colorItem.color).run();
                  }
               }
            },
            isActive: (editor) => {
               if (isHighlight) {
                  if (colorItem.name === 'DEFAULT') {
                     return !editor.isActive('highlight');
                  }
                  return editor.isActive('highlight', { color: colorItem.color });
               } else {
                  if (colorItem.name === 'DEFAULT') {
                     return (
                        !editor.isActive('textStyle') || !editor.getAttributes('textStyle').color
                     );
                  }
                  return editor.isActive('textStyle', { color: colorItem.color });
               }
            },
            value: colorItem.name,
            description: `${
               isHighlight ? 'Highlight' : 'Text'
            } color: ${colorItem.name.toLowerCase()}`,
         };
      }
   );

   // Get active colors for trigger
   const activeColorItem = TEXT_COLORS.find(({ color }) => editor.isActive('textStyle', { color }));
   const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
      editor.isActive('highlight', { color })
   );

   const customTriggerContent = () => (
      <>
         <span
            className="rounded-sm px-1 border text-sm font-medium"
            style={{
               color: activeColorItem?.color || 'currentColor',
               backgroundColor: activeHighlightItem?.color || 'transparent',
            }}
         >
            A
         </span>
         <ChevronDown className="h-3 w-3" />
      </>
   );

   const renderColorItem = (item: SelectorItem, isActive: boolean) => {
      const colorName = item.name.replace('TEXT_COLOR_', '').replace('HIGHLIGHT_COLOR_', '');
      const isHighlight = item.name.startsWith('HIGHLIGHT_');
      const colorItem = isHighlight
         ? HIGHLIGHT_COLORS.find((c) => c.name === colorName)
         : TEXT_COLORS.find((c) => c.name === colorName);

      return (
         <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
               <div
                  className="rounded-sm border px-2 py-px font-medium text-sm"
                  style={
                     isHighlight
                        ? { backgroundColor: colorItem?.color }
                        : { color: colorItem?.color }
                  }
               >
                  A
               </div>
               <div className="flex flex-col items-start">
                  <span className="text-xs">{colorName}</span>
                  <span className="text-xs text-muted-foreground">
                     {isHighlight ? 'BACKGROUND' : 'TEXT'}
                  </span>
               </div>
            </div>
            {isActive && <span className="text-blue-600 text-xs">●</span>}
         </div>
      );
   };

   const clearAllCommand = (editor: Editor) => {
      editor.commands.unsetColor();
      editor.commands.unsetHighlight();
   };

   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={colorItems}
         placeholder="Colors"
         showText={false}
         showDescription={false}
         enableOptimization={true}
         customTriggerContent={customTriggerContent}
         renderItem={renderColorItem}
         showClearButton={true}
         clearAllCommand={clearAllCommand}
         headerTitle="COLORS"
         stateSelector={(ctx) => ({
            colorStates: {
               currentTextColor: ctx.editor.getAttributes('textStyle')?.color,
               currentHighlightColor: ctx.editor.getAttributes('highlight')?.color,
               hasTextColor: ctx.editor.isActive('textStyle'),
               hasHighlight: ctx.editor.isActive('highlight'),
            },
         })}
         width="max-w-[160px]"
      />
   );
};
