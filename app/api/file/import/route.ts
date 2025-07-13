import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
   try {
      // ✅ URL import için JSON data al
      const { url } = await request.json();

      if (!url) {
         return NextResponse.json({ error: 'URL required' }, { status: 400 });
      }

      // URL validation
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(url)) {
         return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }

      // URL'den HTML içeriği çek
      // Optional: Add timeout support using AbortController
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
         headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
         },
         signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
         return NextResponse.json({ 
            error: `Failed to fetch URL: ${response.status}` 
         }, { status: 400 });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Ana içeriği bul ve temizle
      let content = '';
      const title = $('title').text().trim() || 'Imported Content';

      const contentSelectors = [
         'article',
         '[role="main"]',
         'main',
         '.content',
         '.post-content',
         '.entry-content',
         '#content'
      ];

      for (const selector of contentSelectors) {
         const element = $(selector);
         if (element.length && element.text().trim().length > 200) {
            element.find('script, style, nav, header, footer, aside, .ads, .advertisement').remove();
            content = element.html() || '';
            break;
         }
      }

      if (!content || content.trim().length < 100) {
         $('script, style, nav, header, footer, aside, .ads, .advertisement').remove();
         content = $('body').html() || '';
      }

      if (!content || content.trim().length < 50) {
         return NextResponse.json({ 
            error: 'No readable content found' 
         }, { status: 400 });
      }

      return NextResponse.json({
         content: content,
         title: title,
         url: url,
         success: true
      });

   } catch (error) {
      console.error('Import URL error:', error);
      return NextResponse.json(
         { error: 'Failed to import content from URL' },
         { status: 500 }
      );
   }
}