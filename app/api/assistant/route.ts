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

      // Detect language of the query to respond in the correct locale
      let lang: 'en' | 'es' | 'fr' | 'de' | 'hi' = 'en';
      if (lastMessage.includes("puerta") || lastMessage.includes("cómo") || lastMessage.includes("como") || lastMessage.includes("llegar") || lastMessage.includes("sillas") || lastMessage.includes("hola") || lastMessage.includes("español")) {
        lang = 'es';
      } else if (lastMessage.includes("entrée") || lastMessage.includes("comment") || lastMessage.includes("fauteuil") || lastMessage.includes("sac") || lastMessage.includes("bonjour") || lastMessage.includes("français")) {
        lang = 'fr';
      } else if (lastMessage.includes("eingang") || lastMessage.includes("wie") || lastMessage.includes("rollstuhl") || lastMessage.includes("tasche") || lastMessage.includes("hallo") || lastMessage.includes("deutsch")) {
        lang = 'de';
      } else if (lastMessage.includes("प्रवेश") || lastMessage.includes("कैसे") || lastMessage.includes("व्हीलचेयर") || lastMessage.includes("बैग") || lastMessage.includes("नमस्ते") || lastMessage.includes("हिन्दी")) {
        lang = 'hi';
      }

      // Check category of query
      const isAccessibility = lastMessage.includes("wheelchair") || lastMessage.includes("accessible") || lastMessage.includes("disabled") || lastMessage.includes("sensory") ||
                              lastMessage.includes("sillas") || lastMessage.includes("discapacidad") ||
                              lastMessage.includes("fauteuil") || lastMessage.includes("handicap") ||
                              lastMessage.includes("rollstuhl") || lastMessage.includes("behindert") ||
                              lastMessage.includes("व्हीलचेयर") || lastMessage.includes("सुगम");

      const isBagPolicy = lastMessage.includes("bag") || lastMessage.includes("backpack") || lastMessage.includes("luggage") || lastMessage.includes("purse") ||
                           lastMessage.includes("bolsa") || lastMessage.includes("mochila") ||
                           lastMessage.includes("sac") || lastMessage.includes("valise") ||
                           lastMessage.includes("tasche") || lastMessage.includes("rucksack") ||
                           lastMessage.includes("बैग") || lastMessage.includes("थैला");

      const isTransit = lastMessage.includes("train") || lastMessage.includes("metro") || lastMessage.includes("transport") || lastMessage.includes("shuttle") || lastMessage.includes("bus") || lastMessage.includes("transit") ||
                        lastMessage.includes("tren") || lastMessage.includes("autobús") || lastMessage.includes("transporte") ||
                        lastMessage.includes("navette") || lastMessage.includes("métro") ||
                        lastMessage.includes("zug") || lastMessage.includes("u-bahn") ||
                        lastMessage.includes("मेट्रो") || lastMessage.includes("ट्रेन") || lastMessage.includes("बस") || lastMessage.includes("परिवहन");

      const isSpanishTest = lastMessage.includes("cómo llegar a la puerta 3") || lastMessage.includes("como llegar a la puerta 3");

      if (isAccessibility) {
        if (lang === 'es') {
          reply = "♿ **Servicios de Accesibilidad e Inclusión:**\n- **Entrada:** La Puerta 3 (Este Accesible) es nuestra entrada principal sin escalones, equipada con ascensores y escritorios de asistencia ADA dedicados.\n- **Espacio Sensorial:** En la **Zona B** se ubica una Sala Sensorial insonorizada para personas sobreestimuladas.\n- **Ayuda:** Auriculares de comentarios descriptivos están disponibles en la **Zona E**.";
        } else if (lang === 'fr') {
          reply = "♿ **Services d'Accessibilité et d'Inclusion :**\n- **Entrée :** La porte 3 (Est Accessible) est l'entrée principale de plain-pied, avec des ascenseurs et des guichets d'assistance ADA.\n- **Espace Sensoriel :** Une salle sensorielle insonorisée se trouve dans la **Zone B**.\n- **Audio-description :** Des récepteurs de commentaires audio-descriptifs sont disponibles en **Zone E**.";
        } else if (lang === 'de') {
          reply = "♿ **Barrierefreie Dienste und Inklusion:**\n- **Eingang:** Tor 3 (Ost Barrierefrei) ist der stufenlose Haupteingang mit Aufzügen und speziellen ADA-Schaltern.\n- **Sensorik-Raum:** Ein schallisolierter Ruheraum befindet sich in **Zone B**.\n- **Unterstützung:** Audiodeskriptive Empfänger sind in **Zone E** erhältlich.";
        } else if (lang === 'hi') {
          reply = "♿ **सुगम और समावेशी सेवाएँ:**\n- **प्रवेश:** गेट 3 (पूर्व सुगम प्रवेश द्वार) में बिना सीढ़ी का प्रवेश है, जो विशेष काउंटर और लिफ्ट से सुसज्जित है।\n- **शांत कक्ष (Sensory Room):** मानसिक शांति के लिए एक ध्वनि-रोधी सेंसरी रूम **जोन बी** में उपलब्ध है।\n- **सहायता:** दृष्टिबाधित सहायता उपकरण **जोन ई** में उपलब्ध हैं।";
        } else {
          reply = "♿ **Accessibility & Inclusion Services:**\n- **Entry:** Gate 3 (East Accessible) features zero-step entry, low-level service desks, and direct elevators.\n- **Sensory Space:** A soundproof Sensory Room is located in **Zone B**, complete with sensory toys, weighted blankets, and dimmable lighting.\n- **Assistance:** Audio-descriptive commentary transmitters are available at the booth in **Zone E**.";
        }
      } else if (isBagPolicy) {
        if (lang === 'es') {
          reply = "👜 **Política de Bolsas:**\n- Solo se permiten **bolsas de plástico transparentes** que no superen las **12x6x12 pulgadas** (30x15x30 cm).\n- Las mochilas, bolsas de cámaras y equipaje grande están estrictamente prohibidos. No hay casilleros de almacenamiento en las puertas.";
        } else if (lang === 'fr') {
          reply = "👜 **Politique des sacs :**\n- Seuls les **sacs en plastique transparents** de moins de **30x15x30 cm** sont autorisés.\n- Les sacs à dos et valises sont strictement interdits. Aucun casier de stockage n'est disponible aux portes.";
        } else if (lang === 'de') {
          reply = "👜 **Taschen-Richtlinie:**\n- Nur **durchsichtige Plastiktaschen** unter **30x15x30 cm** sind erlaubt.\n- Rucksäcke und Koffer sind strengstens verboten. Es gibt keine Aufbewahrungsschließfächer an den Toren.";
        } else if (lang === 'hi') {
          reply = "👜 **बैग नीति (Bag Policy):**\n- केवल **पारदर्शी प्लास्टिक बैग** (आकार 12x6x12 इंच से कम) ही अंदर ले जाने की अनुमति है।\n- बैकपैक, बड़े थैले और सूटकेस ले जाना सख्त वर्जित है। द्वारों पर बैग जमा करने की कोई व्यवस्था नहीं है।";
        } else {
          reply = "👜 **Bag Policy Reminder:**\n- Only **clear plastic bags** smaller than **12x6x12 inches** (30x15x30 cm) or small clutch bags (under 4.5x6.5 inches) are allowed inside the arena.\n- Backpacks, camera bags, and large purses are strictly prohibited. There are no bag lockers at the gates, so please leave large items in your vehicle.";
        }
      } else if (isTransit) {
        if (lang === 'es') {
          reply = "🚇 **Estado del Transporte Post-Partido:**\n- **Línea Roja del Metro (Norte):** Funcionando sin demoras (8 min de espera).\n- **Línea Azul del Metro (Sur):** ⚠️ **Retraso de 25 min** por fallas de señal. Se aconseja tomar la Línea Roja o Autobuses Lanzadera.\n- **Autobuses Lanzadera (Este):** Flujo constante hacia estacionamientos (12 min de espera).";
        } else if (lang === 'fr') {
          reply = "🚇 **État des transports après match :**\n- **Métro Ligne Rouge (Nord) :** Fluide (8 min d'attente).\n- **Métro Ligne Bleue (Sud) :** ⚠️ **Retard de 25 min** (problème de signal). Prenez la ligne rouge ou les navettes.\n- **Navettes Express (Est) :** Loops réguliers vers les parkings (12 min d'attente).";
        } else if (lang === 'de') {
          reply = "🚇 **Verkehrsstatus nach dem Spiel:**\n- **U-Bahn Rote Linie (Nord):** Reibungsloser Betrieb (8 Min. Wartezeit).\n- **U-Bahn Blaue Linie (Süd):** ⚠️ **25 Min. Verspätung** wegen Signalstörung. Bitte Rote Linie oder Shuttle-Busse nutzen.\n- **Express-Shuttles (Ost):** Kontinuierliche Fahrten zu den Parkplätzen (12 Min. Wartezeit).";
        } else if (lang === 'hi') {
          reply = "🚇 **पारगमन (Transit) स्थिति:**\n- **रेड लाइन मेट्रो (उत्तर):** सामान्य संचालन (8 मिनट प्रतीक्षा समय, हर 3 मिनट में प्रस्थान)।\n- **ब्लू लाइन मेट्रो (दक्षिण):** ⚠️ **25 मिनट की देरी**। वैकल्पिक रूप से रेड लाइन या शटल बस का उपयोग करें।\n- **एक्सप्रेस शuttles (पूर्व):** सुचारू संचालन (12 मिनट प्रतीक्षा समय, व्हीलचेयर अनुकूल)।";
        } else {
          reply = "🚇 **Post-Match Transport Status:**\n- **Red Line Metro (North):** Running smoothly (8 min wait time, departures every 3 mins).\n- **Blue Line Metro (South):** ⚠️ **Delayed (25 min wait)** due to signal issues. Staff advise using the Red Line or Express Shuttles instead.\n- **Express Shuttles (East Hub):** Smooth loops running to Park-and-Ride lots (12 min wait, fully accessible).\n- **Rideshare Hub (Zone C):** Delayed (20 min wait) with high surge pricing.";
        }
      } else if (isSpanishTest) {
        reply = "¡Hola! Para llegar a la **Puerta 3 (Este Accesible)**, diríjase a la zona este del estadio. Esta puerta cuenta con acceso directo desde el terminal de Shuttles ADA y el punto de parada de Rideshare. ¿Necesita información adicional de accesibilidad?";
      } else {
        // General query or greetings in matching language
        if (lang === 'es') {
          reply = "¡Hola! Bienvenidos a StadiumGenie Arena. Puedo ayudarte con accesibilidad (Puerta 3 es accesible), transporte (Metro Línea Roja sin demoras, Línea Azul con retraso de 25 min), y políticas de bolsas (solo bolsas transparentes). ¿En qué te puedo ayudar hoy?";
        } else if (lang === 'fr') {
          reply = "Bonjour ! Bienvenue à l'arène StadiumGenie. Je peux vous aider avec l'accessibilité (Porte 3 accessible), le transport (Métro Ligne Rouge fluide, Ligne Bleue retardée de 25 min) et la politique des sacs. Comment puis-je vous aider ?";
        } else if (lang === 'de') {
          reply = "Hallo! Willkommen in der StadiumGenie Arena. Ich kann Ihnen bei Barrierefreiheit (Tor 3 ist stufenlos), Verkehr (Rote Linie läuft, Blaue Linie verzögert) und Taschen-Richtlinien helfen. Wie kann ich helfen?";
        } else if (lang === 'hi') {
          reply = "नमस्ते! स्टेडियमजेनी एरिना में आपका स्वागत है। मैं आपकी प्रवेश सहायता (गेट 3 सुगम है), मेट्रो पारगमन (रेड लाइन सुचारू है, ब्लू लाइन में देरी है), और बैग नीतियों के संबंध में मदद कर सकता हूँ। मैं आज आपकी क्या सहायता करूँ?";
        } else {
          reply = "👋 **Welcome to StadiumGenie!**\n\nI can help you navigate StadiumGenie Arena for today's FIFA World Cup 2026 match. Ask me about:\n- ♿ *Accessibility access & Sensory Rooms*\n- 🚇 *Live transit wait times & delays*\n- 👜 *Clear bag policy & security gates*\n- 🍔 *Halal, vegan, & gluten-free food courts*\n\n*(Note: Running in Demo Fallback Mode. Configure your `GEMINI_API_KEY` in `.env` to unlock full conversational capability!)*";
        }
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
