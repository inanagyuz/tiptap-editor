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
               // Matematik düğümünü düz metne dönüştür
               const { state } = editor;
               const { from, to } = state.selection;

               let mathNode = null;
               let mathPos = null;

               // inlineMath düğümünü bul
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
                     .setNodeSelection(mathPos) // Matematik düğümünü seç
                     .deleteSelection() // Sil
                     .insertContent(latex) // Düz metin olarak ekle
                     .run();
               }
            } else {
               // Düz metni matematik ifadesine dönüştür
               const { from, to } = editor.state.selection;
               const latex = editor.state.doc.textBetween(from, to);

               if (!latex.trim()) return; // Boş metin kontrolü

               editor
                  .chain()
                  .focus()
                  .deleteSelection() // Seçili metni sil
                  .insertInlineMath({ latex }) // Matematik ifadesi olarak ekle
                  .run();
            }
         }}
      >
         <SigmaIcon className={cn('size-4', { 'text-blue-500': isActiveMath })} strokeWidth={2.3} />
      </Button>
   );
};
