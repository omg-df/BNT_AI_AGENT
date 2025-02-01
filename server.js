import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";
import { TOOLS } from "./helper/tools.js";
import { system_prompt } from "./helper/system_prompt.js";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = TOOLS;

const SYSTEM_PROMPT = system_prompt;

app.post("/ai", async (req, res) => {
  try {
    const { message: userInput } = req.body;
    if (!userInput)
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });

    let messages = [{ role: "system", content: SYSTEM_PROMPT }];

    messages.push({
      role: "user",
      content: JSON.stringify({ type: "user", user: userInput }),
    });

    while (true) {
      // Get AI response
      const chat = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(chat.choices[0].message.content);
      messages.push({ role: "assistant", content: JSON.stringify(aiResponse) });

      console.log(`AI Response:`, aiResponse);

      // If AI outputs a response (final message), return it
      if (aiResponse.type === "output") {
        return res.json({
          success: true,
          response: aiResponse.output,
        });
      }

      // If AI wants to take an action, execute the corresponding function
      if (aiResponse.type === "action") {
        const functionName = aiResponse.function;
        const functionInput = aiResponse.input;

        const fn = tools[functionName];

        if (!fn)
          return res.status(400).json({
            success: false,
            error: `Invalid function: ${functionName}`,
          });

        // Execute the function and get observation
        const observation = await fn(functionInput);

        // AI receives the observation
        const observationMessage = { type: "observation", observation };
        messages.push({
          role: "developer",
          content: JSON.stringify(observationMessage),
        });

        // Continue loop until AI produces a final output
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error processing AI request",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
