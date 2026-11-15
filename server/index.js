import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt, skillLevel = "Beginner" } = req.body || {};
  if (!prompt?.trim()) return res.status(400).json({ error: "Please enter a frontend question or task." });

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      mode: "demo",
      answer: `## Suggested approach for "${prompt}"

### 1) Start with the structure
- Break the interface into a few reusable React sections.
- Define the smallest meaningful state for each piece.
- Keep the markup semantic and easy to scan.

### 2) Build the UI in layers
1. Add the layout first.
2. Add spacing, colors, and typography.
3. Add hover, focus, and responsive behavior.

### 3) Improve the experience
- Test at mobile and desktop widths.
- Check color contrast and keyboard navigation.
- Add loading, empty, and error states where helpful.

### 4) Final polish
- Remove unnecessary complexity.
- Ensure the component reads clearly from a developer's perspective.
- Keep the design consistent with the rest of your app.

**Skill level:** ${skillLevel}

> Demo mode is active. Add your OpenAI API key to enable live AI answers.`
    });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are DevMate, a practical senior frontend mentor. Give accurate, concise, production-minded React, JavaScript, HTML and CSS guidance. Explain code clearly. Mention accessibility and responsive design where relevant." },
        { role: "user", content: `My experience level is ${skillLevel}. Help me with this frontend task: ${prompt}` }
      ],
      temperature: 0.6
    });
    res.json({ mode: "live", answer: response.choices[0]?.message?.content || "I couldn't generate a response. Please try again." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The AI service could not complete your request. Check the server key and try again." });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`DevMate API running at http://localhost:${port}`));