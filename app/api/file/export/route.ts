import { NextRequest, NextResponse } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';

export async function POST(request: NextRequest) {
   try {
      const { html, fileName } = await request.json();

      if (!html) {
         return NextResponse.json({ error: 'HTML content required' }, { status: 400 });
      }

      // HTML'i DOCX'e dönüştür
      const docxBuffer = await HTMLtoDOCX(html, null, {
         table: { row: { cantSplit: true } },
         footer: true,
         pageNumber: true,
         font: 'Arial',
         fontSize: 12,
      });

      // Response headers
      const headers = new Headers();
      headers.set(
         'Content-Type',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      headers.set('Content-Disposition', `attachment; filename="${fileName || 'document'}.docx"`);

      return new NextResponse(docxBuffer, {
         status: 200,
         headers,
      });
   } catch (error) {
      console.error('Export DOCX error:', error);
      return NextResponse.json({ error: 'Failed to export DOCX' }, { status: 500 });
   }
}
