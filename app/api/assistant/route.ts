import { NextResponse } from 'next/server';
import { GATES_DATA, ZONES_DATA, TRANSPORT_DATA, FAQS_DATA } from '@/lib/stadiumData';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build the system prompt using stadium data
    const systemPrompt = `You are StadiumGenie, the official GenAI stadium assistant for the FIFA World Cup 2026 at StadiumGenie Arena.
Your mission is to guide fans, answer stadium-related questions, and provide key accessibility and logistics details.

Here is the current official Stadium Data:
---
STADIUM NAME: StadiumGenie Arena

GATES:
${JSON.stringify(GATES_DATA, null, 2)}

ZONES & AMENITIES:
${JSON.stringify(ZONES_DATA, null, 2)}

TRANSPORTATION STATUS:
${JSON.stringify(TRANSPORT_DATA, null, 2)}

OFFICIAL FAQ POLICY:
${JSON.stringify(FAQS_DATA, null, 2)}
---

RULES:
1. Ground your answers strictly in the provided Stadium Data. Do not hallucinate or invent new gate names, wait times, opening hours, or security protocols.
2. If the user asks a question that is completely outside this data (e.g. "Who is winning the game?", "Can I buy concert tickets?"), politely state that you only have access to stadium logistics and recommend checking with the nearest Guest Service Desk or official tournament app.
3. Automatically detect the user's language (e.g. English, Spanish, Portuguese, German, French, Arabic, Hindi, etc.) and respond in that same language.
4. Keep your responses concise (under 150 words), formatted with bullet points for easy reading on mobile devices.
5. If the user mentions any physical limitations, strollers, sensory overstimulation, or accessibility needs, prioritize highlighting the specific accessible gates (especially Gate 3 East Accessible) and the sensory room in Zone B.`;

    // Check if API key is configured or default
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Mock Fallback responses for demo if no API key is provided
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let reply = "";

      if (lastMessage.includes("gate") || lastMessage.includes("entrance")) {
        reply = "🏟️ **Gate Access Information:**\n- **Gate 3 (East Accessible)** is the primary zero-step entry for accessibility, equipped with ADA desks and elevator connections.\n- **Gates 1 (North Main), 5 (South Main), and 7 (West Gate)** are also open and support wheelchair access.\n- Gate 3 (95% full) and Gate 7 (92% full) are currently experiencing high volume. We recommend using **Gate 2 (North East - 42% capacity)** or **Gate 6 (South West - 30% capacity)** for faster entry.";
      } else if (lastMessage.includes("wheelchair") || lastMessage.includes("accessible") || lastMessage.includes("disabled") || lastMessage.includes("sensory")) {
        reply = "♿ **Accessibility & Inclusion Services:**\n- **Entry:** Gate 3 (East Accessible) features zero-step entry, low-level service desks, and direct elevators.\n- **Sensory Space:** A soundproof Sensory Room is located in **Zone B**, complete with sensory toys, weighted blankets, and dimmable lighting.\n- **Assistance:** Audio-descriptive commentary transmitters are available at the booth in **Zone E**.";
      } else if (lastMessage.includes("bag") || lastMessage.includes("backpack") || lastMessage.includes("luggage")) {
        reply = "👜 **Bag Policy Reminder:**\n- Only **clear plastic bags** smaller than **12x6x12 inches** (30x15x30 cm) or small clutch bags (under 4.5x6.5 inches) are allowed inside the arena.\n- Backpacks, camera bags, and large purses are strictly prohibited. There are no bag lockers at the gates, so please leave large items in your vehicle.";
      } else if (lastMessage.includes("train") || lastMessage.includes("metro") || lastMessage.includes("transport") || lastMessage.includes("shuttle") || lastMessage.includes("bus") || lastMessage.includes("transit")) {
        reply = "🚇 **Post-Match Transport Status:**\n- **Red Line Metro (North):** Running smoothly (8 min wait time, departures every 3 mins).\n- **Blue Line Metro (South):** ⚠️ **Delayed (25 min wait)** due to signal issues. Staff advise using the Red Line or Express Shuttles instead.\n- **Express Shuttles (East Hub):** Smooth loops running to Park-and-Ride lots (12 min wait, fully accessible).\n- **Rideshare Hub (Zone C):** Delayed (20 min wait) with high surge pricing.";
      } else if (lastMessage.includes("hola") || lastMessage.includes("español") || lastMessage.includes("spanish") || lastMessage.includes("puerta") || lastMessage.includes("cómo") || lastMessage.includes("como") || lastMessage.includes("llegar")) {
        reply = "¡Hola! Bienvenidos a StadiumGenie Arena. Puedo ayudarte con accesibilidad (Puerta 3 es accesible), transporte (Metro Línea Roja sin demoras, Línea Azul con retraso de 25 min), y políticas de bolsas (solo bolsas transparentes). ¿En qué te puedo ayudar hoy?";
      } else if (lastMessage.includes("food") || lastMessage.includes("water") || lastMessage.includes("drink") || lastMessage.includes("halal") || lastMessage.includes("gluten")) {
        reply = "🍔 **Food & Beverage Options:**\n- **Outside Food/Drink:** Prohibited, except for medical/infant needs. You can bring an **empty, clear plastic water bottle (up to 20oz)** to fill at water fountains.\n- **Halal & Vegan:** Head to **Food Court A in Zone A**.\n- **Gluten-Free:** Available at **Food Court B in Zone E**, and gluten-free beers are sold at all beverage kiosks.";
      } else {
        reply = "👋 **Welcome to StadiumGenie!**\n\nI can help you navigate StadiumGenie Arena for today's FIFA World Cup 2026 match. Ask me about:\n- ♿ *Accessibility access & Sensory Rooms*\n- 🚇 *Live transit wait times & delays*\n- 👜 *Clear bag policy & security gates*\n- 🍔 *Halal, vegan, & gluten-free food courts*\n\n*(Note: Running in Demo Fallback Mode. Configure your `GEMINI_API_KEY` in `.env` to unlock full conversational capability!)*";
      }

      return NextResponse.json({
        content: reply,
        isDemo: true
      });
    }

    // Prepare Gemini API request
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      return NextResponse.json({ error: "Gemini API request failed. Please check your API key." }, { status: 500 });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I could not process that request.";

    return NextResponse.json({
      content: replyText,
      isDemo: false
    });

  } catch (error: any) {
    console.error("API Assistant route error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
