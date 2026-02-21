const fetch = require('node-fetch');

exports.handler = async (event) => {

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { image, mimeType, context } = JSON.parse(event.body);

    const SYSTEM_PROMPT = `You are an expert marine biologist and fish identification specialist with deep knowledge of KwaZulu-Natal (KZN), South Africa's aquatic species — including marine fish, sharks, rays, sea turtles, marine mammals, crustaceans, cephalopods, and freshwater species found in KZN rivers and estuaries.

When given an image (and optional context notes), identify the species as accurately as possible and respond ONLY with a valid JSON object in exactly this structure:

{
  "confidence": 85,
  "commonName": "Yellowfin Tuna",
  "scientificName": "Thunnus albacares",
  "subspecies": "None / N/A",
  "family": "Scombridae",
  "order": "Scombriformes",
  "conservationStatus": "LC",
  "conservationStatusLabel": "Least Concern",
  "sassiRating": "Orange",
  "sassiNote": "Longline-caught yellowfin is orange-listed. Pole-caught is green.",
  "habitat": "Open ocean, 0–250m depth. Epipelagic to mesopelagic.",
  "distribution": "Pantropical. Common in KZN offshore waters year-round.",
  "typicalSize": "Up to 2.4m, 200kg. Commonly caught at 30–80kg in KZN.",
  "identifyingFeatures": "Bright yellow dorsal and anal fins with elongated finlets. Deep blue-black dorsally, silver-white ventrally. Distinctive yellow lateral stripe on large adults.",
  "dietAndBehaviour": "Apex predator. Schools with other tunas and with dolphins. Highly migratory.",
  "kznContext": "Targeted by ski-boat and game fishing operators off Durban, Richards Bay, and Scottburgh. Peak season June–September when Agulhas Current brings warm blue water inshore.",
  "description": "A brief 2-3 sentence narrative about this species in the context of KZN waters, suitable for a general audience.",
  "cannotIdentify": false,
  "cannotIdentifyReason": ""
}

Conservation status codes: LC (Least Concern), NT (Near Threatened), VU (Vulnerable), EN (Endangered), CR (Critically Endangered), DD (Data Deficient).
SASSi ratings: Green (best choice), Orange (think twice), Red (avoid), Unrated.

If the image is unclear, not an aquatic animal, or you genuinely cannot make an identification, set cannotIdentify to true and explain briefly in cannotIdentifyReason. Set confidence to your honest estimate (0–100).

Respond with ONLY the JSON object. No preamble, no markdown fences, no explanation outside the JSON.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://subsurface-encyclopedia.netlify.app',
        'X-Title': 'Sub-Surface Encyclopedia'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${image}`
                }
              },
              {
                type: 'text',
                text: context
                  ? `Please identify this aquatic species. Additional context from the user: "${context}"`
                  : 'Please identify this aquatic species from the image.'
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', response.status, errBody);
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errBody.error?.message || `OpenRouter API error ${response.status}` })
      };
    }

    const data = await response.json();

    // Extract text from OpenRouter response
    const rawText = data.choices?.[0]?.message?.content || '';

    // Strip any markdown fences just in case
    const cleaned = rawText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

    // Parse the JSON
    const result = JSON.parse(cleaned);

    // Return in the format the frontend expects
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        content: [{ type: 'text', text: JSON.stringify(result) }]
      })
    };

  } catch (error) {
    console.error('Function error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};