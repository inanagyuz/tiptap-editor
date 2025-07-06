'use client';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Type } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { BaseSelector, SelectorItem } from './base-selector';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';

// Preset font boyutları SelectorItem formatında
const FONT_SIZE_ITEMS: SelectorItem[] = [
   {
      name: 'PARAGRAPH',
      icon: Type,
      description: 'Normal text',
      command: (editor) => editor?.chain().focus().setParagraph().run(),
      isActive: (editor) => editor?.isActive('paragraph') ?? false,
   },
   {
      name: 'HEADING_1',
      icon: Heading1,
      level: 1,
      description: 'Heading 1',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 1 }) ?? false,
   },
   {
      name: 'HEADING_2',
      icon: Heading2,
      level: 2,
      description: 'Heading 2',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 2 }) ?? false,
   },
   {
      name: 'HEADING_3',
      icon: Heading3,
      level: 3,
      description: 'Heading 3',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 3 }) ?? false,
   },
   {
      name: 'HEADING_4',
      icon: Heading4,
      level: 4,
      description: 'Heading 4',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 4 }) ?? false,
   },
   {
      name: 'HEADING_5',
      icon: Heading5,
      level: 5,
      description: 'Heading 5',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 5 }) ?? false,
   },
   {
      name: 'HEADING_6',
      icon: Heading6,
      level: 6,
      description: 'Heading 6',
      command: (editor) => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: (editor) => editor?.isActive('heading', { level: 6 }) ?? false,
   },
];

interface FontSizeSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const FontSizeSelector = ({ editor, open, onOpenChange }: FontSizeSelectorProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [customSize, setCustomSize] = useState('');
   const [validationError, setValidationError] = useState('');

   // Mevcut font size'ı al
   const currentFontSize = editor.getAttributes('textStyle').fontSize || '16px';
   const currentSizeNumber = parseInt(currentFontSize);

   useEffect(() => {
      if (open) {
         setCustomSize(currentSizeNumber.toString());
         setValidationError('');
      }
   }, [open, currentSizeNumber]);

   // ✅ Check if any heading is active
   const getActiveHeading = () => {
      for (let i = 1; i <= 6; i++) {
         if (editor.isActive('heading', { level: i })) {
            return i;
         }
      }
      return null;
   };

   // Custom trigger content
   const customTriggerContent = () => {
      const activeHeadingLevel = getActiveHeading();
      const activePreset = FONT_SIZE_ITEMS.find((item) => item.isActive(editor));

      // ✅ Eğer heading aktifse, heading göster
      if (activeHeadingLevel) {
         const HeadingIcon = activePreset?.icon || Type;
         return (
            <>
               <HeadingIcon className="h-4 w-4" />
               <span className="sr-only">H{activeHeadingLevel}</span>
               <ChevronDown className="h-3 w-3" />
            </>
         );
      }

      // ✅ Normal paragraph ise font size göster
      return (
         <>
            <span className="text-xs font-medium">{currentSizeNumber}px</span>
            <ChevronDown className="h-3 w-3" />
         </>
      );
   };

   // Custom size validation
   const validateCustomSize = (size: string): boolean => {
      const num = parseInt(size);
      if (isNaN(num) || num < 8 || num > 200) {
         setValidationError('Font boyutu 8px ile 200px arasında olmalıdır');
         return false;
      }
      setValidationError('');
      return true;
   };

   // Custom size apply
   const applyCustomSize = () => {
      if (validateCustomSize(customSize)) {
         const sizeWithUnit = `${customSize}px`;
         editor.chain().focus().setFontSize(sizeWithUnit).run();
         onOpenChange(false);
      }
   };

   // ✅ Current heading info için additional content
   const additionalContent = (
      <>
         {/* Custom Size Input - sadece paragraph için göster */}
         {!getActiveHeading() && (
            <div className="mb-4">
               <div className="text-xs text-muted-foreground mb-2">{'CUSTOM_SIZE'}</div>
               <div className="flex gap-0 items-center max-w-30">
                  <Input
                     ref={inputRef}
                     type="number"
                     min="8"
                     max="200"
                     value={customSize}
                     onChange={(e) => {
                        setCustomSize(e.target.value);
                        validateCustomSize(e.target.value);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.preventDefault();
                           applyCustomSize();
                        }
                     }}
                     className={cn(
                        'flex-1 bg-background border rounded text-sm outline-none m-0',
                        'focus:ring-2 focus:ring-blue-500',
                        validationError ? 'border-red-500' : 'border-border',
                        'h-7 w-9 rounded-r-none border-r-0'
                     )}
                     placeholder="16"
                  />
                  <Button
                     variant="ghost"
                     className="h-7 w-14 p-0 rounded-md rounded-l-none border-l-0 bg-background text-center"
                     onClick={applyCustomSize}
                     disabled={!!validationError || !customSize}
                  >
                     px <Check className="h-3 w-3" />
                  </Button>
               </div>
               {validationError && (
                  <div className="mt-1 text-xs text-red-600">{validationError}</div>
               )}
            </div>
         )}

         {/* Help Text */}
         <div className="text-xs text-muted-foreground">
            💡 İpucu:{' '}
            {getActiveHeading()
               ? 'Normal text için yukarıdaki "Normal text" seçeneğini tıklayın.'
               : 'Enter tuşu ile hızlı uygulama yapabilirsiniz'}
         </div>
      </>
   );

   // ✅ Clear command - heading varsa paragraph yap, yoksa font size temizle
   const clearCommand = (editor: Editor) => {
      if (getActiveHeading()) {
         editor.chain().focus().setParagraph().run();
      } else {
         editor.chain().focus().unsetFontSize().run();
      }
   };

   if (!editor) return null;

   return (
      <BaseSelector
         editor={editor}
         open={open}
         onOpenChange={onOpenChange}
         items={FONT_SIZE_ITEMS}
         showClearButton={true}
         clearAllCommand={clearCommand}
         customTriggerContent={customTriggerContent}
         showDescription={true}
         showLevel={false}
         additionalContent={additionalContent}
         width="w-48"
         showText={true}
         triggerClassName={cn(
            'min-w-[60px]',
            (getActiveHeading() || currentFontSize !== '16px') && 'bg-accent'
         )}
         enableOptimization={true}
      />
   );
};
