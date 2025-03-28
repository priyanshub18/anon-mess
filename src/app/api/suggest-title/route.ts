const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

export async function POST(req: Request) {
  const { message } = await req.json();
  const prompt = "Give me in one word what should be the suitable title for this mesage given by an anonymous user" + message;
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: 'Give me in one word what should be the suitable title for this mesage given by an anonymous user : "What\'s a small thing that brightened your day today?"' }],
        },
        {
          role: "model",
          parts: [{ text: "Gratitude.\n" }],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
  }
}
