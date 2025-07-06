'use client';
import { type Editor } from '@tiptap/react';
import { AlignJustify, ChevronDown, Check } from 'lucide-react';
import { BaseSelector, type SelectorItem } from './base-selector';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const lineHeightItems: SelectorItem[] = [
   {
      name: 'DEFAULT',
      icon: AlignJustify,
      description: 'Default line height',
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

export const LineHeightSelector = ({ editor, open, onOpenChange }: LineHeightSelectorProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [customLineHeight, setCustomLineHeight] = useState('');
   const [validationError, setValidationError] = useState('');

   // Mevcut line height'ı al
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
      const activeItem = lineHeightItems.find((item) => item.isActive(editor));
      return activeItem?.value || 'Default';
   };

   // Custom trigger content
   const customTriggerContent = () => {
      const activeValue = getActiveLineHeight();
      return (
         <>
            <AlignJustify className="h-4 w-4" />
            <span className="text-xs font-medium">
               {activeValue === 'Default' ? 'Default' : activeValue}
            </span>
            <ChevronDown className="h-3 w-3" />
         </>
      );
   };

   // Custom line height validation
   const validateCustomLineHeight = (lineHeight: string): boolean => {
      const num = parseFloat(lineHeight);
      if (isNaN(num) || num < 0.5 || num > 5.0) {
         setValidationError('Line height 0.5 ile 5.0 arasında olmalıdır');
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
            <div className="text-xs text-muted-foreground mb-1">{'CURRENT_LINE_HEIGHT'}</div>
            <div className="text-sm font-medium">
               {currentLineHeight === 'normal' ? 'Default (1.4)' : `${currentLineHeight}`}
            </div>
         </div>

         {/* Custom Line Height Input */}
         <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">{'CUSTOM_LINE_HEIGHT'}</div>
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
            <div className="text-xs text-muted-foreground mb-2">{'QUICK_PRESETS'}</div>
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
         <div className="text-xs text-muted-foreground">
            💡 İpucu: Enter tuşu ile hızlı uygulama yapabilirsiniz. Değer aralığı: 0.5 - 5.0
         </div>
      </>
   );

   // Custom item render
   const renderItem = (item: SelectorItem, isActive: boolean) => (
      <div className="flex items-center justify-between w-full">
         <div className="flex items-center space-x-2">
            <div className="rounded-sm border p-1">
               {item?.icon && <item.icon className="h-3 w-3" />}
            </div>
            <div className="flex flex-col items-start">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                     {item.value === 'Default' ? 'Default' : `Line Height ${item.value}`}
                  </span>
                  {item.value !== 'Default' && (
                     <span className="text-xs text-muted-foreground">({item.value})</span>
                  )}
               </div>
               <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
         </div>
         {isActive && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
      </div>
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
         renderItem={renderItem}
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
