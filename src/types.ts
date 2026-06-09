export interface TempMailInbox {
  email: string;
  login: string;
  domain: string;
}

export interface TempMailMessageHeader {
  id: number;
  from: string;
  subject: string;
  date: string;
}

export interface TempMailMessage extends TempMailMessageHeader {
  body: string;
  textBody: string;
  htmlBody: string;
}

export interface WaitForEmailOptions {
  subject?: string;
  contains?: string;
  timeoutMs?: number;
  intervalMs?: number;
}
