/* Simple Express server to send contact form emails using Nodemailer.

   Usage:
     1. Place this file in your project root.
     2. Create a .env file with the variables from .env.example.
     3. npm install
     4. node send_email_server.js

   Security: don't commit .env with credentials. Use a trusted SMTP relay (SendGrid, Mailgun, Outlook SMTP, etc.).
*/

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '200kb' }));

// Basic health check
app.get('/_health', (req, res) => res.send({ ok: true }));

// Create transporter from env
function createTransporter(){
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT,10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if(!host || !port || !user || !pass){
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass }
  });
}

app.post('/send-contact', async (req, res) => {
  try{
    const { name, email, message, page } = req.body || {};
    if(!message) return res.status(400).json({ ok: false, error: 'Missing message' });

    const transporter = createTransporter();
    if(!transporter) return res.status(500).json({ ok:false, error: 'SMTP not configured (check .env)' });

    const fromAddress = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const to = (process.env.TO_EMAILS || 'ishyadinesh@outlook.com,neurobloomz@outlook.com');

    const subject = `Website contact: ${name || 'Anonymous'}`;
    const body = [`Name: ${name || '(not provided)'} `, `Email: ${email || '(not provided)'} `, '---', message, '---', `Page: ${page || ''}`, `Sent: ${new Date().toLocaleString()}`].join('\n');

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: body,
    });

    return res.json({ ok: true, info });
  }catch(err){
    console.error('send-contact error', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok:false, error: String(err && err.message ? err.message : err) });
  }
});

app.listen(PORT, ()=>{
  console.log(`send_email_server listening on http://localhost:${PORT}`);
});
