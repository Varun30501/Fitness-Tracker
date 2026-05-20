import { Context } from "koa";
import { generateCoachReply } from "../services/gemini";

export default {
  async ask(ctx: Context) {
    const { prompt, context, history } = ctx.request.body || {};

    if (!prompt || typeof prompt !== "string") {
      return ctx.badRequest("Prompt is required");
    }

    try {
      const reply = await generateCoachReply({ prompt, context, history });
      return ctx.send({ success: true, reply });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Coach request failed";
      return ctx.internalServerError("Coach request failed", { error: message });
    }
  },
};
