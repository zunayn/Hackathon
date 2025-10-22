// File: supabase/functions/generate-milestones/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from 'shared/cors.ts' // CORRECTED IMPORT PATH

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

serve(async (req) => {
  // This handles the preflight request from the browser
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { assignmentTitle, assignmentDescription } = await req.json();
    const prompt = `
      Based on the following academic assignment, generate a concise, step-by-step list of milestones to complete it.
      Return the response as a JSON object containing a single key "milestones", which is an array of objects.
      Each object in the array should have two properties: a "text" (string) for the milestone description and an "eta" (number) for the estimated hours.

      Assignment Title: "${assignmentTitle}"
      Description: "${assignmentDescription}"
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", properties: { "milestones": { type: "ARRAY", items: { type: "OBJECT", properties: { "text": { "type": "STRING" }, "eta": { "type": "NUMBER" } } } } }
        }
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Gemini API failed with status ${response.status}`);
    
    const result = await response.json();
    const jsonText = result.candidates[0].content.parts[0].text;
    const parsedJson = JSON.parse(jsonText);

    return new Response(JSON.stringify(parsedJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

