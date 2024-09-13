import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GPTService {
  private openai: ChatOpenAI;
  private readonly logger = new Logger(GPTService.name);

  constructor(private configService: ConfigService) {
    this.openai = new ChatOpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-4',
      temperature: 0.7,
    });
  }

  async enhanceDescription(
    name: string,
    description: string,
    category?: string,
  ): Promise<string> {
    const prompt = `
            You are an expert in medical sales. Your specialty is medical consumables used by hospitals daily. Your task is to enhance the description of a product based on the information provided.

            Product name: ${name}
            Product description: ${description}
            Category: ${category || 'General'}

            New Description:
        `;

    try {
      const response = await this.callGPT4(prompt);
      return response.content || description; // Return original description if enhancement fails
    } catch (error) {
      this.logger.error(
        `Error enhancing description for product ${name}: ${error.message}`,
      );
      return description; // Return original description if there's an error
    }
  }

  private async callGPT4(prompt: string): Promise<any> {
    try {
      const response = await this.openai.invoke(prompt);
      this.logger.log('GPT-4 response:', response);
      return response;
    } catch (error) {
      this.logger.error('Error calling GPT-4 API:', error);
      throw new Error('Failed to enhance the description.');
    }
  }
}
