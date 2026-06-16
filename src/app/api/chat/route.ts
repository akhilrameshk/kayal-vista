// app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Request body must contain a "messages" array.');
    }

    console.log('API Route: Incoming request with', messages.length, 'messages.');

    const result = await streamText({
      model: groq('llama-3.1-8b-instant'),
      messages,
      system: `You are an expert, helpful, and hospitable customer support AI for "Kayal Vista", a premium luxury houseboat service in Alappuzha, Kerala. 
      
      CRITICAL PRICING RULES:
      - Our base price strictly starts from ₹8,000 onwards on Weekdays.
      - Weekend prices and premium/luxury upper-deck variants are slightly higher depending on the exact cruise dates.
      - NEVER invent random large numbers like  30k, 40k or 50k unless explicitly confirmed. Always quote the baseline: "Our luxury backwater stays start from ₹8,000 onwards for weekday departures."
      - If users ask for a final quote or want to book, politely instruct them to use the WhatsApp button or head to our Contact Page since live booking availability shifts.

      GENERAL RULES:
      - Provide clear, warm, and inviting answers about luxury houseboat stays, scenic cruise routes, and traditional Kerala culinary arrangements (like Karimeen Pollichathu, Al Faham, or traditional feasts on banana leaves). 
      - Keep responses friendly, helpful, and concise for a small chat window`,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process chat request.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}