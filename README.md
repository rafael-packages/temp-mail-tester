# @rafaeldasilvadeveloper/temp-mail-tester

A strongly typed, zero-dependency TypeScript client for temporary email inboxes, ideal for automated E2E tests.

[![NPM Version](https://img.shields.io/npm/v/@rafaeldasilvadeveloper/temp-mail-tester.svg?style=flat-square)](https://www.npmjs.com/package/@rafaeldasilvadeveloper/temp-mail-tester)
[![Discord Support](https://img.shields.io/discord/1111111111?color=7289da&label=Discord&logo=discord&style=flat-square)](https://discord.gg/7Fw7snafYS)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-blueviolet.svg?style=flat-square)](https://www.npmjs.com/package/@rafaeldasilvadeveloper/temp-mail-tester)

## Features

*   🛡️ **TypeScript Definitions**: Complete types mapping the temporary email client API responses.
*   📦 **Zero Dependencies**: Built entirely using native `fetch`. Runs in Node.js, Bun, Cloudflare Workers, Edge, and Serverless environments.
*   🚦 **Poller Helper**: Built-in waiting methods designed specifically to retrieve validation links and codes inside E2E tests.
*   🚀 **Fast Generation**: Instant generation of clean temporary email addresses.

## Installation

```bash
npm install @rafaeldasilvadeveloper/temp-mail-tester
```

## Getting Started

```typescript
import { TempMailClient } from '@rafaeldasilvadeveloper/temp-mail-tester';

const client = new TempMailClient();

async function run() {
  // Create a new temporary inbox
  const inbox = await client.createInbox();
  console.log(`Email address created: ${inbox.email}`);

  // Fetch list of messages
  const messages = await client.getMessages(inbox.login, inbox.domain);
}

run();
```

## Pagination / Waiting for Email in Tests

Use `waitForEmail` to poll the temporary inbox until a specific email (e.g., matching a subject or containing a code) arrives:

```typescript
import { TempMailClient } from '@rafaeldasilvadeveloper/temp-mail-tester';

const client = new TempMailClient();

async function run() {
  const inbox = await client.createInbox();
  
  // Trigger your user registration here on Playwright / Cypress...

  // Wait until email arrives containing verification code
  const email = await client.waitForEmail(inbox.login, inbox.domain, {
    subject: 'Verification',
    contains: 'code is',
    timeoutMs: 30000 // 30 seconds timeout
  });

  console.log(`Received email body: ${email.body}`);
}

run();
```

## Error Handling

Handles network or API issues by throwing standard exceptions when requests fail.

```typescript
try {
  await client.readMessage('invalid', '1secmail.com', 999999);
} catch (error) {
  console.error('Failed to read email message:', error);
}
```

## Support

For support, questions, or discussions, join our Discord server:

[![Discord Server](https://img.shields.io/discord/1111111111?color=7289da&label=Discord&logo=discord&style=for-the-badge)](https://discord.gg/7Fw7snafYS)

## License
MIT
