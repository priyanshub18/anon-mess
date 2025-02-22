import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req: Request) {
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
  const prompt = "Create a list of ten open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "Create a list of 10 open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.\";\ngive me json \n\n" }],
      },
      {
        role: "model",
        parts: [{ text: "```json\n{\n  \"questions\": [\n    \"What's a skill you'd love to master and why?||If you could instantly learn any language, which would it be?||What small act of kindness have you witnessed recently?||What fictional world would you most like to live in for a day?||What's your favorite way to unwind after a long day?||If you could invent a new holiday, what would it celebrate?||What's a song that always puts you in a good mood?||What's something you're looking forward to in the near future?||If you could have any superpower, what would it be and how would you use it to help others?||What's a topic you're currently learning about or interested in exploring?\"\n  ]\n}\n```" }],
      },
    ],
  });
  const result = await chatSession.sendMessage(prompt);
  const ans = new Array(10).fill(null).map((_, i) => result.response.text().split("||")[i]);
  return new Response(ans.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
