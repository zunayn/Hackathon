// File: supabase/functions/summarize-description/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from 'shared/cors.ts' // Uses the shared CORS configuration

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

serve(async (req) => {
  // This handles the browser's preflight request to check CORS permissions
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { description } = await req.json();

    const prompt = `
      Summarize the following assignment description into a single, user-friendly sentence that clearly states the main goal.
      Start the summary with an encouraging and clear phrase like "Your main goal is to..." or "For this assignment, you'll need to...".

      Description: "${description}"
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    const summary = result.candidates[0].content.parts[0].text;

    // Send the successful summary back to the app
    return new Response(JSON.stringify({ summary: summary.trim() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    // If anything goes wrong, send back an error message
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

