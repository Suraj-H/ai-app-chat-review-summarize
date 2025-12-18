import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  instructions?: string;
  previousResponseId?: string;
};

type GenerateTextResponse = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText({
    prompt,
    temperature = 0.2,
    maxTokens = 50,
    model = 'gpt-4o-mini',
    instructions,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResponse> {
    const response = await client.responses.create({
      model,
      input: prompt,
      temperature: temperature,
      max_output_tokens: maxTokens,
      instructions: instructions,
      previous_response_id: previousResponseId,
    });

    return {
      id: response.id,
      text: response.output_text ?? '',
    };
  },
};
