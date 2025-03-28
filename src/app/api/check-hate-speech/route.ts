import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `Analyze the following text and determine whether it contains hate speech. Hate speech includes offensive, discriminatory, or harmful content targeting individuals or groups based on race, ethnicity, gender, religion, nationality, disability, or other protected characteristics. Respond with 'yes' if it contains hate speech and 'no' otherwise. Text: "${message}"`;

    const chatSession = model.startChat();
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text().toLowerCase();

    const isHateSpeech = responseText.includes("yes");

    return new Response(
      JSON.stringify({ message, isHateSpeech }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}