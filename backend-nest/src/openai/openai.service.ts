import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'), 
    });
      this.checkConnection(); // <--- test połączenia

  }

  async translateText(text: string, targetLang: string): Promise<string> {
const system = `You are a professional translator.
Translate the following HTML content into ${targetLang.toUpperCase()}, preserving the original HTML structure and formatting (such as <p>, <strong>, <em>, <ul>, <li>, <a>, etc).
Do not alter any tags or attributes. Only translate the visible text content between the tags.
Ensure the translation is fluent, natural, and contextually accurate.`;

    try {
  const completion = await this.openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: text },
    ],
    temperature: 0.3,
  });

  console.log('✅ OpenAI response:', completion);
  return completion.choices[0].message?.content?.trim() || '';
} catch (error) {
  console.error('❌ OpenAI error:', error);
  return 'Translation failed';
}

  }



private async checkConnection() {
  try {
    const response = await this.openai.models.list(); // prosty ping
    console.log('✅ OpenAI connected. Models available:', response.data.map(m => m.id));
  } catch (error) {
    console.error('❌ Failed to connect to OpenAI:', error);
  }
}
}
