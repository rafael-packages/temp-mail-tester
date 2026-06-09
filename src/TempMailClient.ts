import type {
  TempMailInbox,
  TempMailMessageHeader,
  TempMailMessage,
  WaitForEmailOptions,
} from './types';

/**
 * TempMailClient
 * A modern, zero-dependency client to interact with temporary inboxes for automated testing.
 */
export class TempMailClient {
  private static readonly BASE_URL = 'https://www.1secmail.com/api/v1/';
  private static readonly DOMAINS = ['1secmail.com', '1secmail.org', '1secmail.net'];

  /**
   * Generates a random temporary email inbox.
   */
  public async createInbox(): Promise<TempMailInbox> {
    const randomName = Math.random().toString(36).substring(2, 12);
    const domain =
      TempMailClient.DOMAINS[Math.floor(Math.random() * TempMailClient.DOMAINS.length)];
    return {
      email: `${randomName}@${domain}`,
      login: randomName,
      domain,
    };
  }

  /**
   * Lists all messages currently in the inbox.
   */
  public async getMessages(login: string, domain: string): Promise<TempMailMessageHeader[]> {
    const url = `${TempMailClient.BASE_URL}?action=getMessages&login=${login}&domain=${domain}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return response.json() as Promise<TempMailMessageHeader[]>;
  }

  /**
   * Reads a single email message content by ID.
   */
  public async readMessage(login: string, domain: string, id: number): Promise<TempMailMessage> {
    const url = `${TempMailClient.BASE_URL}?action=readMessage&login=${login}&domain=${domain}&id=${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to read message ${id}: ${response.statusText}`);
    }
    return response.json() as Promise<TempMailMessage>;
  }

  /**
   * Wait/Poll until an email matches specific criteria (useful for E2E testing).
   */
  public async waitForEmail(
    login: string,
    domain: string,
    options: WaitForEmailOptions = {}
  ): Promise<TempMailMessage> {
    const timeout = options.timeoutMs ?? 30000;
    const interval = options.intervalMs ?? 2000;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const messages = await this.getMessages(login, domain);

      for (const msg of messages) {
        let matches = true;

        if (options.subject && !msg.subject.toLowerCase().includes(options.subject.toLowerCase())) {
          matches = false;
        }

        if (matches) {
          // Read full content to check 'contains' option inside body
          const fullMessage = await this.readMessage(login, domain, msg.id);
          if (options.contains) {
            const bodyContent = (
              fullMessage.body +
              fullMessage.textBody +
              fullMessage.htmlBody
            ).toLowerCase();
            if (!bodyContent.includes(options.contains.toLowerCase())) {
              matches = false;
            }
          }

          if (matches) {
            return fullMessage;
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
      `Timeout exceeded waiting for email matching options: ${JSON.stringify(options)}`
    );
  }
}
