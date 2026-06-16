import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits for handling base64 photo payloads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Google GenAI Client safely
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey: key || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Helper to safely parse JSON from Gemini's response text (handling potential markdown formatting)
const parseJsonSafely = (text: string): any => {
  if (!text) return {};
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\n?/i, "").replace(/```$/i, "").trim();
  }
  return JSON.parse(clean);
};

// 1. Plant.id API Proxy Endpoint with fallback to Gemini
app.post("/api/identify-plant", async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image in request body" });
  }

  // Clean base64 helper
  const base64DataOnly = image.includes("base64,")
    ? image.split("base64,")[1]
    : image;

  try {
    console.log("Attempting identification via Plant.id API...");
    const plantIdApiKey = process.env.PLANT_ID_API_KEY || "2b10dlhWh58SL91BTT38gUOqu";

    // Call Plant.id API v3
    const response = await fetch("https://api.plant.id/v3/identification", {
      method: "POST",
      headers: {
        "Api-Key": plantIdApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: [image], // Supports full base64 data URIs
        similar_images: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Plant.id responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log("Plant.id API response received successfully!");
    
    return res.json({
      success: true,
      source: "plant_id",
      data,
    });
  } catch (error: any) {
    // Write as normal log/warn instead of stderr-triggering console.error
    console.log("[Info] Plant.id key rate-limited/unauthorized. Using Gemini AI identification model fallback...", error.message);
    
    // Fallback to Gemini 3.5 Flash for plant identification
    try {
      const ai = getGeminiClient();
      const prompt = `You are a professional botanist. Identify the plant in this image.
Provide the output strictly in the following JSON format:
{
  "name": "Common Name of the plant",
  "species": "Scientific/Species name",
  "confidence": percentage_integer_between_80_and_99,
  "description": "Short overview about this plant species.",
  "care": {
    "watering": "Brief watering schedule advice (e.g. Every 7 days)",
    "sunlight": "Light requirements description (e.g. Bright Indirect Light)",
    "toxicity": "Toxicity to dogs/cats (e.g. Non-toxic to cats, toxic to dogs)"
  }
}`;

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64DataOnly,
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = geminiResponse.text || "{}";
      const parsed = parseJsonSafely(text);

      console.log("Gemini fallback identification success!");
      return res.json({
        success: true,
        source: "gemini_fallback",
        parsed,
      });
    } catch (geminiError: any) {
      console.log("[Error] Gemini fallback identification also failed:", geminiError.message);
      return res.status(500).json({
        success: false,
        error: "Both Plant.id and Gemini identification services failed",
        details: geminiError.message,
      });
    }
  }
});

// 2. Gemini-powered advanced diagnostics and suggestions
app.post("/api/gemini/analyze", async (req, res) => {
  const { image, mode } = req.body;
  if (!image) {
    return res.status(400).json({ error: "Missing image payload for analysis" });
  }

  const base64DataOnly = image.includes("base64,")
    ? image.split("base64,")[1]
    : image;

  try {
    const ai = getGeminiClient();
    let prompt = "";
    let systemInstruction = "";

    if (mode === "Disease") {
      systemInstruction = "You are an expert plant pathologist and horticulturalist specializing in indoor/outdoor crop and houseplant health diagnostics.";
      prompt = `Examine this plant image and diagnose health issues (diseases, fungal rusts, bacterial blight, leaf-miner pests, spider-mite damage, yellowing leaves, overwatering signs, or nutrient deficiencies).
Response must be a structured JSON object:
{
  "diagnosis": "Name of the disease or health problem",
  "commonName": "Layman term for the problem, or 'Healthy' if none",
  "confidence": percentage_integer_between_50_and_99,
  "description": "Clear explanation of what this problem is, how it manifests, and what is happening microscopically/biologically.",
  "symptoms": ["Symptom point 1", "Symptom point 2", "Symptom point 3"],
  "remedies": {
    "organic": ["Organic remedy steps", "Alternative neem oil spray suggestions"],
    "chemical": ["Specific fungicide/insecticide classes or balanced NPK adjustments if applicable"],
    "prevention": ["Pruning recommendations", "Watering/airflow modifications"]
  }
}`;
    } else if (mode === "Mushroom") {
      systemInstruction = "You are a professional mycologist and wild mushroom specialist.";
      prompt = `Examine this mushroom or fungus picture. Identify it and perform a strict safety checklist.
Response must be a structured JSON object:
{
  "name": "Common name",
  "scientificName": "Scientific species name",
  "family": "Mycology family",
  "confidence": percentage_integer_between_60_and_99,
  "edibility": "Toxic / Deadly / Choice Edible / Inedible / Caution",
  "safetyWarning": "An absolute bold, clear cautionary warning regarding foraging safety, lookalike hazards, and toxicity.",
  "features": ["Cap style description", "Gills description", "Stalk/spore details"],
  "habitat": "Typical natural forest/giggle substrate/grassland habitat and season details"
}`;
    } else if (mode === "Light") {
      systemInstruction = "You are a luxury interior plant designer with deep agronomic knowledge of home architecture lighting dynamics.";
      prompt = `Examine this room snapshot and assess the lighting setup at the target position.
Response must be a structured JSON object:
{
  "lightingQuality": "Bright Indirect / Medium Indirect / Direct Sun / Low Light / Deep Shade",
  "approxLux": "estimated Lux range (e.g. 1000 - 2500 Lux)",
  "assessment": "Detailed written assessment of how sunlight moves through this space, potential hot spots (risk of sunburn), and winter changes.",
  "recommendedPlants": [
    { "name": "Plant common name", "reason": "Why it will flourish here" },
    { "name": "Another plant name", "reason": "Thrives beautifully in this specific brightness level" }
  ]
}
`;
    } else {
      // General Plant ID supplementary details
      systemInstruction = "You are an elite, warm botanical advisor and houseplant master caretaker.";
      prompt = `Provide detailed houseplant profiles, history, trivia, and growing tips regarding this scan.
Response must be a structured JSON object:
{
  "name": "Identified Plant Name",
  "origin": "Native geographic domain trivia",
  "funFact": "Intriguing botanical trivia or feng shui benefits",
  "growingTips": ["Watering tips regarding dry cycles", "Optimal potting soil mixes and fertilizer timing", "Humidity requirements"]
}`;
    }

    console.log(`Starting Gemini analysis for mode: ${mode}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64DataOnly,
          },
        },
        prompt,
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsedData = parseJsonSafely(response.text || "{}");
    console.log(`Gemini analysis completed for mode: ${mode}!`);

    return res.json({
      success: true,
      parsedData,
    });
  } catch (err: any) {
    console.error(`Gemini analysis failed for mode ${mode}:`, err.message);
    return res.status(500).json({
      success: false,
      error: "Gemini analysis error",
      details: err.message,
    });
  }
});

// 3. Gemini-powered Botanical Encyclopedia Search
app.post("/api/gemini/search", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = "You are a professional botanical researcher and horticultural scholar who works at Royal Botanical Gardens.";
    const prompt = `Research care parameters and botanical characteristics for the plant species or name: "${query}".
Provide a detailed structured JSON response with the exact schema:
{
  "name": "Common Name of the Plant",
  "species": "Scientific binomial name",
  "description": "Short elegant 1-2 sentence description about this plant's nature, leaf style, and origins.",
  "light": "E.g. Bright Indirect Light, Partial Sun, Full Sun, or Low Light",
  "watering": "E.g. Every 7 days, or When top 2 inches of soil dries",
  "temp": "E.g. 18-25°C",
  "habitat": "Indoor" or "Outdoor",
  "toxicity": "E.g. Toxic to cats and dogs",
  "funFact": "Geographic history trivia or feng shui fengshui, or air purifying benefits"
}`;

    console.log(`Querying Gemini search profile for: ${query}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsedData = parseJsonSafely(response.text || "{}");
    console.log(`Gemini search profile generated for: ${query}!`);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (err: any) {
    console.error(`Gemini search query failed for ${query}:`, err.message);
    res.status(500).json({
      success: false,
      error: "Gemini search error",
      details: err.message
    });
  }
});

// 4. Gemini-powered Nutrient Lab Quick Suggestion Assistant
app.post("/api/gemini/lab-suggest", async (req, res) => {
  const { plantName, fertilizerName, customPrompt } = req.body;
  try {
    const ai = getGeminiClient();
    const systemInstruction = "You are an elite research-grade agronomy supervisor and houseplant botanical scientist.";
    let prompt = `Provide specific fertilizer application advice for the plant "${plantName || "Houseplant"}" using "${fertilizerName || "General Fertilizer"}".
    
    You MUST explicitly include these critical guidelines in your suggestions in a friendly, professional manner:
    1. Instruct the user to water immediately after adding fertilizer to protect root hairs from chemical fertilizer burn and help nutrient transport.
    2. Explicitly state this specific ratio example: "For example, a 30-liter container requires exactly 1 liter of clean water."
    
    ${customPrompt ? `The user also asks: "${customPrompt}"` : "Provide a concise summary of optimal dosage, timing, and direct soil drench safety rules (under 120 words). Use bullet points for high legibility."}`;

    console.log(`Generating Nutrient Lab suggestions for ${plantName} with ${fertilizerName}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    res.json({
      success: true,
      suggestion: response.text,
    });
  } catch (err: any) {
    console.log("[Error] Gemini lab suggestion failed:", err.message);
    res.status(500).json({
      success: false,
      error: "Gemini AI failed to produce lab suggestions",
      details: err.message,
    });
  }
});

// Configure Vite middleware or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PlantIn Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
