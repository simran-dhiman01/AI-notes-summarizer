import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";


const groq = new Groq({
  apiKey: process.env.API_KEY,
});

export const generateSummary = async (req, res) => {
  try {
    const prompt = req.body.prompt || "";
    let transcript = "";

    // Case 1: plain text input
    if (req.body.transcript) {
      transcript = req.body.transcript;
    }
    // Case 2: uploaded file
    else if (req.file) {
      transcript = req.file.buffer.toString("utf-8"); // read file content
    } 
    else {
      return res.status(400).json({ success: false, error: "Transcript text or file is required" });
    }

   
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: prompt || "Summarize this transcript clearly and concisely.",
        },
        { role: "user", content: transcript },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "No summary generated";

    res.status(200).json({ success: true, summary });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate summary" });
  }
};

