import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
   try {
      // ✅ File upload için formData al
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
         return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const fileSize = file.size;
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (fileSize > maxSize) {
         return NextResponse.json(
            {
               error: 'File too large. Maximum size is 10MB.',
            },
            { status: 400 }
         );
      }

      let content = '';
      const title = file.name.split('.')[0];
      let contentType = 'html';

      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      try {
         if (
            fileType ===
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
         ) {
            // ✅ DOCX için mammoth'u dynamic import ile kullan
            try {
               const mammoth = await import('mammoth');
               const arrayBuffer = await file.arrayBuffer();

               // ✅ mammoth için Buffer kullan
               const result = await mammoth.convertToHtml({
                  buffer: Buffer.from(arrayBuffer),
               });

               content = result.value;
               contentType = 'html';

               // Uyarıları logla
               if (result.messages.length > 0) {
                  console.warn('DOCX conversion warnings:', result.messages);
               }
            } catch (mammothError) {
               console.error('DOCX conversion failed:', mammothError);
               return NextResponse.json(
                  {
                     error: 'DOCX file conversion failed. Please try converting to HTML manually.',
                  },
                  { status: 400 }
               );
            }
         } else if (
            fileType === 'text/html' ||
            fileName.endsWith('.html') ||
            fileName.endsWith('.htm')
         ) {
            // HTML dosyası
            content = await file.text();
            contentType = 'html';
         } else if (
            fileType === 'text/markdown' ||
            fileName.endsWith('.md') ||
            fileName.endsWith('.markdown')
         ) {
            // Markdown dosyası
            const markdown = await file.text();
            content = convertMarkdownToHTML(markdown);
            contentType = 'html';
         } else if (fileType === 'application/json' || fileName.endsWith('.json')) {
            // JSON dosyası
            const jsonText = await file.text();
            try {
               const jsonData = JSON.parse(jsonText);
               return NextResponse.json({
                  content: jsonData,
                  title: title,
                  fileName: file.name,
                  contentType: 'json',
                  success: true,
               });
            } catch (parseError) {
               console.error('JSON parse error:', parseError);
               return NextResponse.json(
                  {
                     error: 'Invalid JSON format',
                  },
                  { status: 400 }
               );
            }
         } else if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
            // Plain text dosyası
            const text = await file.text();
            const paragraphs = text.split('\n').filter((p) => p.trim());
            content = paragraphs.map((p) => `<p>${p}</p>`).join('');
            contentType = 'html';
         } else {
            return NextResponse.json(
               {
                  error: `Unsupported file type: ${fileType}. Supported: HTML, Markdown, JSON, TXT, DOCX`,
               },
               { status: 400 }
            );
         }

         // ✅ Content validasyonu
         if (!content || content.trim().length === 0) {
            return NextResponse.json(
               {
                  error: 'File appears to be empty or unreadable',
               },
               { status: 400 }
            );
         }

         return NextResponse.json({
            content: content,
            title: title,
            fileName: file.name,
            fileSize: fileSize,
            contentType: contentType,
            success: true,
         });
      } catch (conversionError) {
         console.error('File conversion error:', conversionError);
         return NextResponse.json(
            {
               error: `Failed to convert file: ${
                  typeof conversionError === 'object' &&
                  conversionError &&
                  'message' in conversionError
                     ? (conversionError as { message: string }).message
                     : String(conversionError)
               }`,
            },
            { status: 500 }
         );
      }
   } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Failed to process uploaded file' }, { status: 500 });
   }
}

// Helper function - Markdown'u HTML'e çevir

// ✅ Daha güçlü Markdown converter
function convertMarkdownToHTML(markdown: string): string {
   let html = markdown;

   // Headers
   html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
   html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
   html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

   // Bold & Italic
   html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
   html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

   // Links
   html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/g, '<a href="$2">$1</a>');

   // Code blocks
   html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
   html = html.replace(/`([^`]*)`/g, '<code>$1</code>');

   // Lists - Her satırı ayrı işle
   const lines = html.split('\n');
   const processedLines: string[] = [];
   let inList = false;

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^\* (.+)$/)) {
         if (!inList) {
            processedLines.push('<ul>');
            inList = true;
         }
         processedLines.push('<li>' + line.replace(/^\* /, '') + '</li>');
      } else {
         if (inList) {
            processedLines.push('</ul>');
            inList = false;
         }
         processedLines.push(line);
      }
   }

   if (inList) {
      processedLines.push('</ul>');
   }

   html = processedLines.join('\n');

   // Paragraphs
   html = html.replace(/\n\n/g, '</p><p>');
   html = html.replace(/^(?!<[h1-6]|<ul|<pre|<code)(.+)$/gm, '<p>$1</p>');

   return html;
}
