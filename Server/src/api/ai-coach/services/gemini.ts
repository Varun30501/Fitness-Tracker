import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type CoachRequest = {
  prompt: string;
  context?: Record<string, unknown>;
  history?: Array<{ role: string; text: string }>;
};

export const generateCoachReply = async ({ prompt, context = {}, history = [] }: CoachRequest) => {
  const recentHistory = history
    .slice(-6)
    .map((message) => `${message.role}: ${message.text}`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: [
          "You are FitCoach, a concise fitness and nutrition helper inside a calorie tracking app.",
          "Use the provided app context first. Give practical, non-medical suggestions.",
          "Do not diagnose conditions, prescribe treatment, or claim certainty about calories.",
          "Keep the answer under 90 words and make it actionable.",
          "",
          `Today context JSON: ${JSON.stringify(context)}`,
          recentHistory ? `Recent chat:\n${recentHistory}` : "",
          `User request: ${prompt}`,
        ].join("\n"),
      },
    ],
    config: {
      temperature: 0.55,
    },
  });

  const text = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text;
  return (text || "I could not generate a reply right now. Try asking again with a little more detail.").trim();
};
