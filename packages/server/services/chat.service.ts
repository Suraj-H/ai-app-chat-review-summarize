import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.prompt.txt';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const instructions = template.replace('{{information}}', '...');

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      instructions: instructions,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },

  async sendMessageWithGemini(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    // It's crucial to retrieve the previous conversation history to maintain context.
    // The 'conversationRepository' would need to store and retrieve the full
    // chat history for a given 'conversationId'.
    //
    // const conversationHistory = conversationRepository.getConversationHistory(conversationId);

    // For a basic text-only chat, we use the `gemini-1.5-flash` model.

    // Start a new chat session with the previous history.
    const chat = model.startChat({
      // history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 0.2,
      },
    });

    // Send the new message to the chat session.
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // The Gemini API doesn't return a unique ID for each message directly in the same way as OpenAI.
    // A common practice is to generate a unique ID yourself or use the timestamp.
    const uniqueId = conversationId + '-' + Date.now();

    // Update the conversation history with both the user's prompt and the model's response.
    // conversationRepository.addMessageToHistory(conversationId, { role: 'user', parts: [{ text: prompt }] });
    // conversationRepository.addMessageToHistory(conversationId, { role: 'model', parts: [{ text: text }] });

    return {
      id: uniqueId,
      message: text,
    };
  },
};
