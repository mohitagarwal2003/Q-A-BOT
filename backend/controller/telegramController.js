import { PDFText } from "../models/pdfText.js"; // Import the PDFText model
import axios from "axios";

// Handles the Telegram webhook and responds to user queries
export const handleWebhook = async (req, res) => {
  console.log("Webhook hit");
  console.log("Request Body:", req.body);
  const message = req.body.message;
  console.log(message);

  if (message && message.text) {
    const chatId = message.chat.id;
    const userQuery = message.text;

    // 1. Search MongoDB for relevant text
    const relevantText = await searchPDFText(userQuery);

    let responseText;
    if (relevantText) {
      // 2. If relevant text is found, pass it to OpenAI for enhanced response
      responseText = await enhanceWithOpenAI(relevantText);
    } else {
      // 3. If no relevant text found, use OpenAI to directly respond to the user's query
      responseText = await getOpenAIResponse(userQuery);
    }

    // 4. Send the response back to Telegram
    await sendMessageToTelegram(chatId, responseText);
    res.sendStatus(200); // Acknowledge Telegram we received the message
  } else {
    console.log("No message found in request");
    res.sendStatus(200);
  }
};

// 5. Search MongoDB for relevant text based on user query
const searchPDFText = async (query) => {
  try {
    const result = await PDFText.findOne({
      text: { $regex: query, $options: "i" }, // Case-insensitive regex search
    }).exec();

    return result ? result.text : null;
  } catch (error) {
    console.error("Error searching PDF text in MongoDB:", error);
    return null;
  }
};

// 6. Enhance text from MongoDB with OpenAI
const enhanceWithOpenAI = async (text) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Improve and organize this information: ${text}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content; // Extract enhanced text
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    return text; // Fallback to the original text if OpenAI fails
  }
};

// 7. Call OpenAI API directly for general user queries
const getOpenAIResponse = async (userQuery) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userQuery }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content; // Extract the AI response
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    return "Sorry, I could not process your request."; // Fallback response
  }
};

// 8. Send message back to Telegram
const sendMessageToTelegram = async (chatId, text) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
    });
    console.log("Message sent to chat ID:", chatId);
  } catch (error) {
    console.error("Error sending message to Telegram:", error.response.data);
    throw error;
  }
};
