import { describe, it, expect, beforeEach, spyOn } from 'bun:test';
import { TempMailClient } from '../src/TempMailClient';

describe('TempMailClient', () => {
  let client: TempMailClient;

  beforeEach(() => {
    client = new TempMailClient();
  });

  it('should generate an inbox', async () => {
    const inbox = await client.createInbox();
    expect(inbox.email).toBeDefined();
    expect(inbox.login).toBeDefined();
    expect(inbox.domain).toBeDefined();
    expect(inbox.email).toContain('@');
  });

  it('should list messages', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(
        JSON.stringify([
          { id: 123, from: 'sender@example.com', subject: 'Verify Account', date: '2026-06-09' },
        ]),
        { status: 200 }
      );
    });

    const messages = await client.getMessages('test', '1secmail.com');
    expect(messages.length).toBe(1);
    expect(messages[0].id).toBe(123);
    expect(messages[0].subject).toBe('Verify Account');

    fetchSpy.mockRestore();
  });

  it('should read a message', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return new Response(
        JSON.stringify({
          id: 123,
          from: 'sender@example.com',
          subject: 'Verify Account',
          date: '2026-06-09',
          body: 'Activation code is 9876',
          textBody: 'Activation code is 9876',
          htmlBody: '<p>Activation code is 9876</p>',
        }),
        { status: 200 }
      );
    });

    const msg = await client.readMessage('test', '1secmail.com', 123);
    expect(msg.body).toContain('9876');

    fetchSpy.mockRestore();
  });
});
