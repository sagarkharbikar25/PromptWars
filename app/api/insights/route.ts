import { NextResponse } from 'next/server';
import { getGates, getZones, getTransport } from '@/lib/supabase';

export async function GET() {
  try {
    const gates = await getGates();
    const zones = await getZones();
    const transport = await getTransport();

    const apiKey = process.env.GEMINI_API_KEY;

    // Structured system instructions for JSON output
    const prompt = `You are the StadiumGenie AI Operations Engine.
Analyze the following live stadium data:

GATES TELEMETRY:
${JSON.stringify(gates, null, 2)}

ZONES & CROWD STATUS:
${JSON.stringify(zones, null, 2)}

TRANSIT STATUS:
${JSON.stringify(transport, null, 2)}

Identify operational bottlenecks, safety concerns, overcrowding, and transit delays. 
Generate exactly 3 priority recommendations for stadium staff to resolve these issues.

Provide the response as a raw JSON array of 3 objects. Each object must have these exact keys:
- "title": A short, direct instruction title (e.g., "Redirect Gate 3 to Gate 2")
- "priority": Either "High", "Medium", or "Low"
- "description": A clear, 1-2 sentence tactical recommendation for ground crew.
- "category": Either "Crowd Control", "Transportation", "Security", or "Logistics"

Return ONLY the raw JSON array of objects. Do not wrap it in markdown code blocks like \`\`\`json or add introductory text.`;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Mock Fallback Recommendations if no API key
      const mockRecommendations = [
        {
          title: "Reroute Gate 3 Crowd to Gate 2",
          priority: "High",
          description: "Gate 3 is at critical occupancy (95%). Dispatch terminal marshals to redirect arriving fans at the Red Line Metro to Gate 2, which is operating at only 42% capacity.",
          category: "Crowd Control"
        },
        {
          title: "Activate Covered Walkway Signage",
          priority: "Medium",
          description: "Blue Line Metro reports 25-minute delays due to signal failures. Activate digital billboards in Zone E advising fans to take the Red Line or Shuttle Buses.",
          category: "Transportation"
        },
        {
          title: "Reinforce Security Presence in Zone D",
          priority: "Medium",
          description: "Zone D (Active Fan Stand) has reached 'Overcrowded' crowd level and is currently set to 'Alert' security status. Relocate 4 roaming security units from Zone C to assist with crowd management.",
          category: "Security"
        }
      ];

      return NextResponse.json({
        recommendations: mockRecommendations,
        isDemo: true
      });
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json", // Request structured JSON directly from Gemini!
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error (Insights):", errText);
      throw new Error("Failed to query Gemini API");
    }

    const resData = await response.json();
    const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // Parse the JSON array
    let recommendations = [];
    try {
      recommendations = JSON.parse(rawText.trim());
    } catch (parseErr) {
      console.error("JSON parsing error of Gemini output:", rawText, parseErr);
      // Clean up markdown blocks if the model ignored responseMimeType
      let cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      recommendations = JSON.parse(cleaned);
    }

    return NextResponse.json({
      recommendations,
      isDemo: false
    });

  } catch (error: any) {
    console.error("API Insights route error:", error);
    // Graceful fallback to prevent dashboard breaking
    return NextResponse.json({
      recommendations: [
        {
          title: "System Telemetry Diagnostic",
          priority: "High",
          description: "Operational insights system failed to load live AI recommendations. Verify Gemini API key in configuration settings.",
          category: "Logistics"
        }
      ],
      error: error.message || "Internal server error"
    });
  }
}
