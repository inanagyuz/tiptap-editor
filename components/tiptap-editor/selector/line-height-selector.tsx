/**
 * @module LineHeightSelector
 *
 * This module provides the LineHeightSelector React component for selecting and customizing line height in the Tiptap editor.
 * It displays the current line height, quick presets, and allows entering a custom line height with validation.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's setLineHeight and unsetLineHeight commands.
 * - Shows the current line height value in the trigger and info panel.
 * - Allows quick selection from presets and custom input with validation (0.5 - 5.0).
 * - Displays help text and validation errors.
 * - Includes a clear button to reset line height to default.
 *
 * @example
 * ```tsx
 * <LineHeightSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
'use client';
import { type Editor } from '@tiptap/react';
import { AlignJustify, ChevronDown, Check } from 'lucide-react';
import { BaseSelector, type SelectorItem } from './base-selector';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { i18n } from '../i18n';

const lineHeightItems: SelectorItem[] = [
   {
      name: 'DEFAULT',
      icon: AlignJustify,
      command: (editor) => editor?.chain().focus().unsetLineHeight().run(),
      isActive: (editor) => {
         if (!editor) return false;
         const lineHeight = editor.getAttributes('textStyle')?.lineHeight;
         return !lineHeight || lineHeight === 'normal';
      },
      value: 'Default',
   },
];

interface LineHeightSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

/**
 * LineHeightSelector component for selecting and customizing line height in the editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */

export const LineHeightSelector = ({ editor, open, onOpenChange }: LineHeightSelectorProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [customLineHeight, setCustomLineHeight] = useState('');
   const [validationError, setValidationError] = useState('');

   const currentLineHeight = editor.getAttributes('textStyle')?.lineHeight || 'normal';
   const currentLineHeightNumber =
      currentLineHeight === 'normal' ? 1.4 : parseFloat(currentLineHeight) || 1.4;

   useEffect(() => {
      if (open) {
         setCustomLineHeight(currentLineHeightNumber.toString());
         setValidationError('');
      }
   }, [open, currentLineHeightNumber]);

   // Get current active line height for display
   const getActiveLineHeight = () => {
      const lineHeight = editor.getAttributes('textStyle')?.lineHeight;
      if (!lineHeight || lineHeight === 'normal') {
         return i18n.t('DEFAULT');
      }
      return lineHeight;
   };

   const customTriggerContent = () => {
      const activeValue = getActiveLineHeight();
      return (
         <>
            <AlignJustify className="h-4 w-4" />
            <span className="text-xs font-medium">{activeValue}</span>
            <ChevronDown className="h-3 w-3" />
         </>
      );
   };

   // Custom line height validation
   const validateCustomLineHeight = (lineHeight: string): boolean => {
      const num = parseFloat(lineHeight);
      if (isNaN(num) || num < 0.5 || num > 5.0) {
         setValidationError(i18n.t('LINEHEIGHT_RANGE_ERROR'));
         return false;
      }
      setValidationError('');
      return true;
   };

   // Custom line height apply
   const applyCustomLineHeight = () => {
      if (validateCustomLineHeight(customLineHeight)) {
         editor.chain().focus().setLineHeight(customLineHeight).run();
         onOpenChange(false);
      }
   };

   // Clear line height
   const clearLineHeight = (editor: Editor) => {
      editor.chain().focus().unsetLineHeight().run();
   };

   // Additional content for custom input
   const additionalContent = (
      <>
         {/* Current Line Height Display */}
         <div className="mb-4 p-2 bg-muted rounded">
            <div className="text-xs text-muted-foreground mb-1">
               {i18n.t('CURRENT_LINE_HEIGHT')}
            </div>
            <div className="text-sm font-medium">
               {currentLineHeight === 'normal' ? i18n.t('DEFAULT') : `${currentLineHeight}`}
            </div>
         </div>

         {/* Custom Line Height Input */}
         <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">{i18n.t('CUSTOM_LINE_HEIGHT')}</div>
            <div className="flex gap-0 items-center">
               <Input
                  ref={inputRef}
                  type="number"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={customLineHeight}
                  onChange={(e) => {
                     setCustomLineHeight(e.target.value);
                     validateCustomLineHeight(e.target.value);
                  }}
                  onKeyDown={(e) => {
                     if (e.key === 'Enter') {
                        e.preventDefault();
                        applyCustomLineHeight();
                     }
                  }}
                  className={cn(
                     'flex-1 bg-background border rounded text-sm outline-none m-0',
                     'focus:ring-2 focus:ring-blue-500',
                     validationError ? 'border-red-500' : 'border-border',
                     'h-7 w-16 rounded-r-none border-r-0'
                  )}
                  placeholder="1.5"
               />
               <Button
                  variant="ghost"
                  className="h-7 w-12 p-0 rounded-md rounded-l-none border-l-0 bg-background text-center"
                  onClick={applyCustomLineHeight}
                  disabled={!!validationError || !customLineHeight}
               >
                  <Check className="h-3 w-3" />
               </Button>
            </div>
            {validationError && <div className="mt-1 text-xs text-red-600">{validationError}</div>}
         </div>

         {/* Quick Presets */}
         <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">{i18n.t('QUICK_PRESETS')}</div>
            <div className="grid grid-cols-4 gap-1">
               {['1.0', '1.5', '2.0', '2.5'].map((preset) => (
                  <Button
                     key={preset}
                     size="sm"
                     variant={currentLineHeight === preset ? 'default' : 'outline'}
                     onClick={() => {
                        editor.chain().focus().setLineHeight(preset).run();
                        onOpenChange(false);
                     }}
                     className="h-6 text-xs"
                  >
                     {preset}
                  </Button>
               ))}
            </div>
         </div>

         {/* Help Text */}
         <div className="text-xs text-muted-foreground">💡 {i18n.t('LINEHEIGHT_HELP')}</div>
      </>
   );
   if (!editor) return null;

   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={lineHeightItems}
         placeholder="Line Height"
         showText={true}
         showDescription={true}
         width="w-64"
         showClearButton={true}
         clearAllCommand={clearLineHeight}
         customTriggerContent={customTriggerContent}
         additionalContent={additionalContent}
         headerTitle="LINE_HEIGHT"
         triggerClassName={cn('min-w-[60px]', currentLineHeight !== 'normal' && 'bg-accent')}
         enableOptimization={true}
         stateSelector={(ctx) => ({
            lineHeightState: {
               currentLineHeight: ctx.editor.getAttributes('textStyle')?.lineHeight,
               hasLineHeight: ctx.editor.isActive('textStyle'),
            },
         })}
      />
   );
};
