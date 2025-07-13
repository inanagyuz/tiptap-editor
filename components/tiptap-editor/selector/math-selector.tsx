
/**
 * @module MathSelector
 *
 * This module provides the MathSelector React component for toggling mathematical expressions in the Tiptap editor.
 * It allows users to convert selected text to inline math or revert math nodes back to plain LaTeX text.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Checks for active math nodes (math, inlineMath, blockMath).
 * - If a math node is active, converts it back to LaTeX text.
 * - If no math node is active, converts selected text to an inline math node.
 * - Uses SigmaIcon for the button.
 *
 * @example
 * ```tsx
 * <MathSelector editor={editor} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import { SigmaIcon } from 'lucide-react';

export const MathSelector = ({ editor }: { editor: Editor }) => {
   // Matematik düğümü türlerini kontrol et
   const mathTypes = ['math', 'inlineMath', 'blockMath'];
   const isActiveMath = mathTypes.some((type) => editor.isActive(type));

   return (
      <Button
         variant="ghost"
         size="sm"
         className="rounded-none w-10"
         onClick={() => {
            if (isActiveMath) {
                
               const { state } = editor;
               const { from, to } = state.selection;

               let mathNode = null;
               let mathPos = null;

       
               state.doc.nodesBetween(from, to, (node, pos) => {
                  if (mathTypes.includes(node.type.name)) {
                     if (node.attrs?.latex) {
                        mathNode = node;
                        mathPos = pos;
                        return false;
                     }
                  }
               });

               if (mathNode && mathPos !== null) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore - Mathematics uzantısı attrs türünü doğru tanımlamıyor
                  const latex = mathNode.attrs.latex || '';
                  editor
                     .chain()
                     .focus()
                     .setNodeSelection(mathPos)  
                     .deleteSelection()  
                     .insertContent(latex)  
                     .run();
               }
            } else {
               
               const { from, to } = editor.state.selection;
               const latex = editor.state.doc.textBetween(from, to);

               if (!latex.trim()) return;  
               editor
                  .chain()
                  .focus()
                  .deleteSelection()  
                  .insertInlineMath({ latex }) 
                  .run();
            }
         }}
      >
         <SigmaIcon className={cn('size-4', { 'text-blue-500': isActiveMath })} strokeWidth={2.3} />
      </Button>
   );
};
