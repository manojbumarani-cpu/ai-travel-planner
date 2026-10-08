import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { destination, budget, days, interest } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing in .env.local' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Generate an ultra-unique travel blueprint for ${destination} for ${days} days with a ${budget} budget, tailored for a ${interest} travel style. 
    For the budgetBreakdown, provide estimates in the LOCAL currency of ${destination} using local symbols or currency codes.
    Also include:
    - "weatherOutlook": A short description of expected weather/climate.
    - "transitGuide": Advice on the best transit passes or ways to get around this specific destination.
    - "seasonality": "Best months to visit, peak vs off-peak season overview."
    - "emergencyAndPhrases": { "emergencyNumber": "Local emergency digits", "phrases": ["Phrase 1 - Meaning", "Phrase 2 - Meaning"] }
    You must return ONLY raw JSON matching this structure exactly, with no markdown formatting or extra text:
    {
      "destination": "${destination}",
      "summary": "Short inspiring narrative overview of the trip",
      "coordinates": [35.6762, 139.6503],
      "touristTrapsToAvoid": ["Trap 1 to skip", "Trap 2 to skip"],
      "localSecret": "An insider secret known only to locals",
      "mustVisitPlaces": ["Place 1", "Place 2", "Place 3", "Place 4"],
      "budgetBreakdown": {
        "accommodation": "Estimated cost in local currency",
        "food": "Estimated cost in local currency",
        "activities": "Estimated cost in local currency",
        "transport": "Estimated cost in local currency"
      },
      "weatherOutlook": "Expected climate/weather summary",
      "seasonality": "Best time to visit summary",
      "transitGuide": "Best local transport tips/passes",
      "emergencyAndPhrases": {
        "emergencyNumber": "112 / 911",
        "phrases": ["Hello - ...", "Thank you - ..."]
      },
      "packingList": ["Item 1", "Item 2", "Item 3", "Item 4"],
      "itinerary": [
        {
          "day": 1,
          "activities": ["Activity 1 with secret tip", "Activity 2 with secret tip"]
        }
      ],
      "restaurants": ["Restaurant 1", "Restaurant 2"]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    let text = response.text || '{}';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error generating trip with Gemini:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate trip' }, { status: 500 });
  }
}