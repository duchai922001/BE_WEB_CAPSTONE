import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatboxAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Lấy API Key từ biến môi trường
    });
  }

  async createResponse(prompt: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // model dùng phổ biến hiện nay
      messages: [{ role: 'user', content: prompt }],
    });

    // Lấy nội dung trả về
    return completion.choices[0].message.content;
  }
}
