import { Check, ChevronDown, X, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type Editor, useEditorState } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export interface SelectorItem {
   name: string;
   icon?: LucideIcon;
   command: (editor: Editor) => void;
   isActive: (editor: Editor) => boolean;
   level?: number;
   description?: string;
   shortcut?: string;
   value?: string;
}

interface BaseSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   items: SelectorItem[];
   placeholder?: string;
   showText?: boolean;
   showLevel?: boolean;
   showDescription?: boolean;
   showShortcut?: boolean;
   additionalContent?: React.ReactNode;
   width?: string;
   triggerClassName?: string;
   contentClassName?: string;
   itemClassName?: string;
   iconSize?: 'sm' | 'md' | 'lg';
   multiSelect?: boolean;
   showClearButton?: boolean;
   clearAllCommand?: (editor: Editor) => void;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   customTriggerContent?: (activeItems: SelectorItem[], editorState: any) => React.ReactNode;
   headerTitle?: string;
   showQuickActions?: boolean;
   quickActions?: Array<{
      icon: LucideIcon;
      command: (editor: Editor) => void;
      isActive: (editor: Editor) => boolean;
      title: string;
   }>;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   renderItem?: (item: SelectorItem, isActive: boolean, editorState: any) => React.ReactNode;
   // ✅ Optimization options
   enableOptimization?: boolean;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   stateSelector?: (ctx: { editor: Editor }) => any;
}

const EditorBubbleItem = ({
   children,
   onSelect,
   className,
   editor,
}: {
   children: React.ReactNode;
   onSelect: (editor: Editor) => void;
   className?: string;
   editor: Editor;
}) => {
   return (
      <Button
         variant="ghost"
         size="sm"
         onClick={() => onSelect(editor)}
         className={className}
         type="button"
      >
         {children}
      </Button>
   );
};

export const BaseSelector = ({
   editor,
   open,
   onOpenChange,
   items,
   placeholder = 'Select option',
   showText = true,
   showLevel = false,
   showDescription = false,
   showShortcut = false,
   additionalContent,
   width = 'min-w-[20px]',
   triggerClassName = '',
   contentClassName = '',
   itemClassName = '',
   iconSize = 'md',
   multiSelect = false,
   showClearButton = false,
   clearAllCommand,
   customTriggerContent,
   headerTitle,
   showQuickActions = false,
   quickActions = [],
   renderItem,
   enableOptimization = true,
   stateSelector,
}: BaseSelectorProps) => {
   // ✅ Default state selector - covers most common use cases
   const defaultStateSelector = (ctx: { editor: Editor }) => {
      if (!ctx.editor) return { activeStates: {} };

      return {
         activeStates: {
            // Text formatting marks
            bold: ctx.editor.isActive('bold'),
            italic: ctx.editor.isActive('italic'),
            underline: ctx.editor.isActive('underline'),
            strike: ctx.editor.isActive('strike'),
            code: ctx.editor.isActive('code'),
            subscript: ctx.editor.isActive('subscript'),
            superscript: ctx.editor.isActive('superscript'),
            link: ctx.editor.isActive('link'),

            // Block elements
            paragraph: ctx.editor.isActive('paragraph'),
            heading: ctx.editor.isActive('heading'),
            heading1: ctx.editor.isActive('heading', { level: 1 }),
            heading2: ctx.editor.isActive('heading', { level: 2 }),
            heading3: ctx.editor.isActive('heading', { level: 3 }),
            heading4: ctx.editor.isActive('heading', { level: 4 }),
            heading5: ctx.editor.isActive('heading', { level: 5 }),
            heading6: ctx.editor.isActive('heading', { level: 6 }),
            blockquote: ctx.editor.isActive('blockquote'),
            codeBlock: ctx.editor.isActive('codeBlock'),
            horizontalRule: ctx.editor.isActive('horizontalRule'),

            // Lists
            bulletList: ctx.editor.isActive('bulletList'),
            orderedList: ctx.editor.isActive('orderedList'),
            taskList: ctx.editor.isActive('taskList'),

            // Alignment
            textLeft: ctx.editor.isActive({ textAlign: 'left' }),
            textCenter: ctx.editor.isActive({ textAlign: 'center' }),
            textRight: ctx.editor.isActive({ textAlign: 'right' }),
            textJustify: ctx.editor.isActive({ textAlign: 'justify' }),

            // Tables
            table: ctx.editor.isActive('table'),
            tableRow: ctx.editor.isActive('tableRow'),
            tableCell: ctx.editor.isActive('tableCell'),
            tableHeader: ctx.editor.isActive('tableHeader'),

            // Media
            image: ctx.editor.isActive('image'),
            video: ctx.editor.isActive('video'),

            // Colors and styles
            textColor: ctx.editor.getAttributes('textStyle')?.color,
            backgroundColor: ctx.editor.getAttributes('highlight')?.color,
            fontSize: ctx.editor.getAttributes('textStyle')?.fontSize,
            fontFamily: ctx.editor.getAttributes('textStyle')?.fontFamily,

            // Document state
            isEmpty: ctx.editor.isEmpty,
            hasSelection: !ctx.editor.state.selection.empty,
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
         },
      };
   };

   // ✅ useEditorState with optimization
   const editorState = useEditorState({
      editor,
      selector: enableOptimization ? stateSelector || defaultStateSelector : () => ({}),
   });

   // ✅ Optimized active items calculation
   const { activeItems, optimizedItems } = useMemo(() => {
      const activeItems = multiSelect
         ? items.filter((item) => item.isActive(editor))
         : items.filter((item) => item.isActive(editor));

      // ✅ If optimization is enabled, try to use cached state
      const optimizedItems =
         enableOptimization && editorState.activeStates
            ? items.map((item) => ({
                 ...item,
                 isActive: (editor: Editor) => {
                    // Try to get from cached state first
                    const stateKey = getStateKeyFromItem(item);
                    if (stateKey && editorState.activeStates[stateKey] !== undefined) {
                       return editorState.activeStates[stateKey];
                    }

                    // Fallback to original isActive
                    return item.isActive(editor);
                 },
              }))
            : items;

      return { activeItems, optimizedItems };
   }, [items, editor, multiSelect, enableOptimization, editorState.activeStates]);

   const firstActiveItem = activeItems[0] || items[0];

   const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
   };

   // ✅ Smart state key mapping
   const getStateKeyFromItem = (item: SelectorItem): string | null => {
      const name = item.name.toLowerCase();

      // Direct mappings
      const directMappings: Record<string, string> = {
         bold: 'bold',
         italic: 'italic',
         underline: 'underline',
         strikethrough: 'strike',
         strike: 'strike',
         code: 'code',
         code_block: 'codeBlock',
         subscript: 'subscript',
         superscript: 'superscript',
         block_quote: 'blockquote',
         blockquote: 'blockquote',
         bullet_list: 'bulletList',
         numbered_list: 'orderedList',
         ordered_list: 'orderedList',
         task_list: 'taskList',
         horizontal_rule: 'horizontalRule',
         paragraph: 'paragraph',
         text: 'paragraph',
         link: 'link',
      };

      // Check direct mappings first
      if (directMappings[name]) {
         return directMappings[name];
      }

      // Heading levels
      if (name.startsWith('heading') || name.startsWith('h')) {
         const level = item.level || (name.match(/\d+/) ? parseInt(name.match(/\d+/)![0]) : null);
         if (level) {
            return `heading${level}`;
         }
         return 'heading';
      }

      // Text alignment
      if (name.includes('left')) return 'textLeft';
      if (name.includes('center')) return 'textCenter';
      if (name.includes('right')) return 'textRight';
      if (name.includes('justify')) return 'textJustify';

      return null;
   };

   // ✅ Default item render function with optimization
   const defaultRenderItem = (item: SelectorItem, isActive: boolean) => (
      <div className="flex items-center justify-between w-full">
         <div className="flex items-center space-x-2">
            {item.icon && (
               <div className="rounded-sm border p-1">
                  <item.icon className="h-3 w-3" />
               </div>
            )}
            <div className="flex flex-col items-start">
               <span className="text-xs font-medium">{item.name}</span>
               {showLevel && item.level && (
                  <span className="text-xs text-muted-foreground">Level {item.level}</span>
               )}
               {showDescription && item.description && (
                  <span className="text-xs text-muted-foreground">{item.description}</span>
               )}
               {showShortcut && item.shortcut && (
                  <span className="text-xs text-muted-foreground">{item.shortcut}</span>
               )}
            </div>
         </div>
         {isActive && <Check className="h-4 w-4 text-blue-600" />}
      </div>
   );

   // ✅ Optimized trigger content
   const triggerContent = () => {
      if (customTriggerContent) {
         return customTriggerContent(activeItems, editorState);
      }

      if (multiSelect) {
         if (activeItems.length === 0) {
            return (
               <>
                  <span className="text-xs text-muted-foreground">{placeholder}</span>
                  <ChevronDown className="h-3 w-3" />
               </>
            );
         }
         if (activeItems.length === 1) {
            const item = activeItems[0];
            return (
               <>
                  {item.icon && <item.icon className={iconSizeClasses[iconSize]} />}
                  {showText && (
                     <span className="text-xs hidden sm:inline">{item.value || item.name}</span>
                  )}
                  <ChevronDown className="h-3 w-3" />
               </>
            );
         }
         return (
            <>
               <span className="text-xs">{activeItems.length} selected</span>
               <ChevronDown className="h-3 w-3" />
            </>
         );
      }

      if (activeItems.length > 0) {
         const activeItem = activeItems[0];
         return (
            <>
               {activeItem.icon && <activeItem.icon className={iconSizeClasses[iconSize]} />}
               {showText && (
                  <span className="text-xs hidden sm:inline">
                     {activeItem.value || activeItem.name}
                  </span>
               )}
               {showLevel && activeItem.level && (
                  <span className="text-xs text-muted-foreground">H{activeItem.level}</span>
               )}
               <ChevronDown className="h-3 w-3" />
            </>
         );
      }

      return (
         <>
            {firstActiveItem?.icon && (
               <firstActiveItem.icon className={iconSizeClasses[iconSize]} />
            )}
            {showText && (
               <span className="text-xs hidden sm:inline text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-3 w-3" />
         </>
      );
   };

   const handleClearAll = () => {
      if (clearAllCommand) {
         clearAllCommand(editor);
         onOpenChange(false);
      }
   };

   if (!editor) return null;

   return (
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button
               size="sm"
               variant="ghost"
               className={cn(
                  'gap-1 px-2 rounded-none border-none h-8',
                  multiSelect && activeItems.length > 0 && 'bg-accent',
                  activeItems.length > 0 && !multiSelect && 'bg-accent/50',
                  triggerClassName
               )}
            >
               {triggerContent()}
            </Button>
         </PopoverTrigger>

         <PopoverContent
            sideOffset={5}
            align="start"
            className={cn(width, 'p-1', contentClassName)}
         >
            {/* Header */}
            {(headerTitle || (showClearButton && activeItems.length > 0)) && (
               <div className="flex items-center justify-between mb-2 px-2 border-b pb-2">
                  {headerTitle && (
                     <div className="text-sm font-semibold text-muted-foreground">
                        {headerTitle}
                     </div>
                  )}
                  {showClearButton && activeItems.length > 0 && clearAllCommand && (
                     <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClearAll}
                        className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
                     >
                        <X className="h-3 w-3 mr-1" />
                        {'CLEAR_ALL'}
                     </Button>
                  )}
               </div>
            )}

            {/* Items */}
            <div className="flex flex-col max-h-64 overflow-y-auto">
               {optimizedItems.map((item) => {
                  const isActive = item.isActive(editor);

                  return (
                     <EditorBubbleItem
                        key={item.name}
                        editor={editor}
                        onSelect={(editor) => {
                           item.command(editor);
                           if (!multiSelect) {
                              onOpenChange(false);
                           }
                        }}
                        className={cn(
                           'flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent',
                           isActive && 'bg-accent',
                           itemClassName
                        )}
                     >
                        {renderItem
                           ? renderItem(item, isActive, editorState)
                           : defaultRenderItem(item, isActive)}
                     </EditorBubbleItem>
                  );
               })}
            </div>

            {/* Quick Actions */}
            {showQuickActions && quickActions.length > 0 && (
               <div className="border-t pt-2 mt-2">
                  <div className="text-xs text-muted-foreground mb-2 px-2">{'QUICK_ACTIONS'}</div>
                  <div className="grid grid-cols-4 gap-1 px-2">
                     {quickActions.map((action, index) => (
                        <Button
                           key={index}
                           size="sm"
                           variant={action.isActive(editor) ? 'default' : 'outline'}
                           onClick={() => {
                              action.command(editor);
                              onOpenChange(false);
                           }}
                           className="h-6 p-0"
                           title={action.title}
                        >
                           <action.icon className="h-3 w-3" />
                        </Button>
                     ))}
                  </div>
               </div>
            )}

            {/* Additional Content */}
            {additionalContent && <div className="border-t pt-2 mt-2">{additionalContent}</div>}
         </PopoverContent>
      </Popover>
   );
};
