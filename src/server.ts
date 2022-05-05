import "dotenv/config";
import express, { json } from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

console.log(process.env);

const app = express();

app.use(json());

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

const transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  }
});

app.post("/feedbacks", async (request, response) => {
  const { type, comment, screenshot } = request.body;
  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot
    }
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Diego Fernandes <diego.schell.f@gmail.com>",
    subject: "Novo feedback",
    html: [
      '<div style="font-family: sans-serif; font-size: 1rem; color: #111;">',
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      '</div>'
    ].join('\n')
  });

  return response.status(201).json({ data: feedback });
})

app.listen(3333, () => {
  console.log("HTTP Server running!")
});