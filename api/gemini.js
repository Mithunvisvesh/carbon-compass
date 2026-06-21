import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in environment variables');
      return res.status(500).json({ error: 'API Key Configuration Error' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(responseText);
  } catch (error) {
    console.error('Error in gemini serverless function:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
