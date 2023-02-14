import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "typegram";
import { welcomeText } from "./constants";
import axios from "axios";
import { downloadFile } from "./utils";

const bot: Telegraf<Context<Update>> = new Telegraf(
	(process.env.BOT_TOKEN as string) ||
		"6106449025:AAFHdxhi_9BnJ9StR8RF1qSjERz2K2UteV4"
);

bot.start((ctx) => ctx.reply(welcomeText));

bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.command("sharenote", (ctx) => {
	ctx.reply(
		"Not tipi",
		Markup.inlineKeyboard([
			Markup.button.callback("Fotoğraf", "first"),
			Markup.button.callback("PDF", "second"),
		])
	);
});
bot.command("PDF", (ctx) => {
	ctx.reply(
		"Not tipi",
		Markup.inlineKeyboard([
			Markup.button.callback("Yükle", "first"),
			Markup.button.callback("Boşver", "second"),
		])
	);
});
bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.on("document", async (ctx) => {
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
	console.log(ctx);
	ctx.reply("helloooo");
});

bot.launch().then(() => console.log("Bot started"));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
