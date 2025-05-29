import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

export interface TokenProvider {
  getToken: () => Promise<TokenInfo>;
  saveToken: (token: TokenInfo) => Promise<void>;
}

@Injectable()
export class FileTokenProvider implements TokenProvider {
  private readonly tokenPath = './google-token.json';

  async getToken(): Promise<TokenInfo> {
    try {
      const token = await fs.readFile(this.tokenPath, 'utf-8');
      return JSON.parse(token);
    } catch (error) {
      throw new Error('No se encontró el token de Google Calendar');
    }
  }

  async saveToken(token: TokenInfo): Promise<void> {
    await fs.writeFile(this.tokenPath, JSON.stringify(token));
  }
}
