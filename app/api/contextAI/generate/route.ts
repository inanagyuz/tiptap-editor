import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { match } from 'ts-pattern';

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = 'edge';

type UIMessage = {
   role: 'system' | 'user' | 'assistant' | 'data';
   content: string;
};

export async function POST(req: Request): Promise<Response> {
   const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
   });

   // Check if the OPENAI_API_KEY is set, if not return 400
   if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === '') {
      return new Response('Missing OPENAI_API_KEY - make sure to add it to your .env file.', {
         status: 400,
      });
   }

   const { prompt, option, command, mcpContext, mcpTool } = await req.json();

   // MCP bağlamı için ek sistem prompt'u
   const mcpEnhancement = mcpContext
      ? '\n\nÖnemli: Bu istek MCP (Model Context Protocol) ile güçlendirilmiştir. Proje bağlamını dikkate alarak yanıt verin.'
      : '';

   const messages: UIMessage[] = match(option)
      .with('continue', () => [
         {
            role: 'system' as const,
            content:
               'Önceki metinden gelen bağlama göre mevcut metni sürdüren bir AI yazma asistanısınız. ' +
               'Başlangıçtaki karakterlerden daha sonraki karakterlere daha fazla ağırlık/öncelik verin. ' +
               'Yanıtınızı 200 karakterden fazla olmayacak şekilde sınırlayın, ancak tam cümleler kurduğunuzdan emin olun.' +
               'Uygun olduğunda Markdown biçimlendirmesini kullanın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: prompt,
         },
      ])
      .with('improve', () => [
         {
            role: 'system' as const,
            content:
               'Mevcut metni geliştiren bir AI yazma asistanısınız.' +
               'Yanıtınızı 200 karakterden fazla olmayacak şekilde sınırlayın, ancak tam cümleler kurduğunuzdan emin olun.' +
               'Uygun olduğunda Markdown biçimlendirmesini kullanın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Mevcut metin: ${prompt}`,
         },
      ])
      .with('shorter', () => [
         {
            role: 'system' as const,
            content:
               'Mevcut metni kısaltan bir AI yazma asistanısınız.' +
               'Uygun olduğunda Markdown biçimlendirmesini kullanın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Mevcut metin: ${prompt}`,
         },
      ])
      .with('longer', () => [
         {
            role: 'system' as const,
            content:
               'Mevcut metni uzatan bir AI yazma asistanısınız.' +
               'Uygun olduğunda Markdown biçimlendirmesini kullanın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Mevcut metin: ${prompt}`,
         },
      ])
      .with('fix', () => [
         {
            role: 'system' as const,
            content:
               'Mevcut metindeki dil bilgisi ve yazım hatalarını düzelten bir AI yazma asistanısınız.' +
               'Yanıtınızı 200 karakterden fazla olmayacak şekilde sınırlayın, ancak tam cümleler kurduğunuzdan emin olun.' +
               'Uygun olduğunda Markdown biçimlendirmesini kullanın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Mevcut metin: ${prompt}`,
         },
      ])
      .with('zap', () => [
         {
            role: 'system' as const,
            content:
               'Siz, bir komut istemine göre metin üreten bir AI yazma asistanısınız.' +
               'Kullanıcıdan bir girdi ve metni düzenlemek için bir komut alırsınız.' +
               'Yanıtınızı sadece düz metin olarak verin, markdown formatlaması kullanmayın. ' +
               'Başlıklar, kalın yazı veya diğer markdown işaretlerini kullanmayın.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Bu metin için: ${prompt}. You have to respect the command: ${command}`,
         },
      ])
      .with('mcp_context', () => [
         {
            role: 'system' as const,
            content:
               'Sen bir akıllı editör asistanısın. MCP (Model Context Protocol) ile proje bağlamını anlayarak, ' +
               'kullanıcıya kod ve proje ile ilgili yardım ediyorsun. Verilen bağlam bilgisini kullanarak ' +
               'doğru ve yararlı öneriler sun. Uygun olduğunda Markdown biçimlendirmesini kullanın.',
         },
         {
            role: 'user' as const,
            content: `${command}\n\nBağlam Bilgisi:\n${prompt}`,
         },
      ])
      .with('mcp_enhanced', () => [
         {
            role: 'system' as const,
            content:
               `Sen bir gelişmiş AI kod asistanısın. MCP araçları ile proje analizi yaparak, ` +
               `kullanıcının kodunu anlayıp en iyi önerileri sunuyorsun. ` +
               `MCP Aracı: ${mcpTool || 'genel analiz'}. ` +
               `Uygun olduğunda Markdown biçimlendirmesini kullanın.`,
         },
         {
            role: 'user' as const,
            content: `${command}\n\nAnaliz edilecek içerik:\n${prompt}`,
         },
      ])
      .with('english', () => [
         {
            role: 'system' as const,
            content:
               'Siz, metinleri İngilizceye çeviren bir dil çevirmeni yapay zeka asistanısınız. ' +
               'Sadece çeviriyi döndürün, hiçbir açıklama veya ek metin eklemeyin.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Bu metni İngilizceye çevir: ${prompt}`,
         },
      ])
      .with('turkish', () => [
         {
            role: 'system' as const,
            content:
               'Siz, metinleri Türkçeye çeviren bir dil çevirmeni yapay zeka asistanısınız. ' +
               'Sadece çeviriyi döndürün, hiçbir açıklama veya ek metin eklemeyin.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Bu metni Türkçeye çevir: ${prompt}`,
         },
      ])
      .with('german', () => [
         {
            role: 'system' as const,
            content:
               'Siz, metinleri Almancaya çeviren bir dil çevirmeni yapay zeka asistanısınız. ' +
               'Sadece çeviriyi döndürün, hiçbir açıklama veya ek metin eklemeyin.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: `Bu metni Almancaya çevir: ${prompt}`,
         },
      ])
      .with('standard', () => [
         {
            role: 'system' as const,
            content:
               'Siz yardımcı bir yapay zeka asistanısınız. Kullanıcının isteklerini yerine getirin.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: command || prompt,
         },
      ])
      .otherwise(() => [
         {
            role: 'system' as const,
            content:
               'Siz yardımcı bir yapay zeka asistanısınız. Kullanıcının isteklerini yerine getirin.' +
               mcpEnhancement,
         },
         {
            role: 'user' as const,
            content: command || prompt,
         },
      ]);

   const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
   });

   // Respond with the stream
   return result.toDataStreamResponse();
}
