import { setTimeout } from "node:timers/promises";

export default {
  name: "test-2",
  actions: {
    stream: {
      async handler(ctx) {
        ctx.params.on("data", (data) => this.logger.info('ctx.params data'/* , Buffer.from(data).toString() */));
        ctx.params.on("error", (err) => this.logger.error('ctx.params', err.message));
        ctx.params.on("end", () => this.logger.info('ctx.params', 'end'));

        await setTimeout(12000)

        return ctx.params;
      },
    },
  },
};
