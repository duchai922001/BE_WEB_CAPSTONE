import { Module } from '@nestjs/common';
import { ChatboxAIService } from './chatbox-ai.service';
import { ChatboxAIController } from './chatbox-ai.controller';

@Module({
  controllers: [ChatboxAIController],
  providers: [ChatboxAIService],
})
export class ChatboxAIModule {}
