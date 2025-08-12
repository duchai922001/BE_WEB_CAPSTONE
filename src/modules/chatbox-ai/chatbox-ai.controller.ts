import { Controller, Post, Body } from '@nestjs/common';
import { ChatboxAIService } from './chatbox-ai.service';

@Controller('chatbox-ai')
export class ChatboxAIController {
  constructor(private readonly chatboxAIService: ChatboxAIService) {}

  @Post('response')
  async getResponse(@Body('prompt') prompt: string) {
    const output = await this.chatboxAIService.createResponse(prompt);
    return { output };
  }
}
