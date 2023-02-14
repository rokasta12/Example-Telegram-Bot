import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "typegram";
import { welcomeText } from "./constants";
import axios from "axios";
import { downloadFile, saveFormDataForSubmission } from "./utils";

const bot: Telegraf<Context<Update>> = new Telegraf(
	(process.env.BOT_TOKEN as string) ||
		"6106449025:AAFHdxhi_9BnJ9StR8RF1qSjERz2K2UteV4"
);

bot.start((ctx) => ctx.reply(welcomeText));

bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.command("sharenote", async (ctx) => {
	const x = await ctx.reply(
		"Paylaşmak istediğiniz notun başlığı ne olsun",
		/* Markup.inlineKeyboard([
			Markup.button.callback("Fotoğraf", "first"),
			Markup.button.callback("PDF", "second"),
		]) */
		/* Markup.keyboard(["Fotoğraf", "PDF"]).oneTime().resize() */
		Markup.forceReply()
	);
});

bot.action("first", (ctx) => {
	ctx.reply(
		"Not tipi",
		Markup.inlineKeyboard([
			Markup.button.callback("X", "first"),
			Markup.button.callback("Y", "second"),
		])
	);
});

bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.on("document", async (ctx) => {
	const userName = ctx.update.message.from.username;
	const chatId = ctx.update.message.chat.id;
	console.log(userName, chatId);
	const { file_id: fileId, file_name } = ctx.update.message.document;
	const fileUrl = await ctx.telegram.getFileLink(fileId);

	/* TODO: send url or file itself to place for saving */
	/* const response = await axios.get(fileUrl.toString()); */
	await downloadFile(fileUrl.toString(), "./cache/" + file_name);
	ctx.reply(
		"I read the file for you! The contents were:\n\n" +
			fileUrl /* response.data */
	);
});

bot.on("message", (ctx) => {
	const userID = ctx.update.message.from.id;
	const mess = ctx.update.message as any;
	const message = mess?.text;
	const currentStatus = saveFormDataForSubmission({ userID, message });
	ctx.reply("Please enter " + currentStatus);
});

bot.launch().then(() => console.log("Bot started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
