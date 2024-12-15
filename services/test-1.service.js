import { PassThrough, Readable } from 'node:stream'
import { setTimeout } from "node:timers/promises";

const testData = new Array(100000).fill({ token: crypto.randomUUID() });

export default {
  name: "test-1",
  actions: {
    stream: {
      async handler(ctx) {
        const inputStream = new Readable({
          read() { }
        });

        inputStream.on("data", (data) => this.logger.info('inputStream data'/* , Buffer.from(data).toString() */));
        inputStream.on("error", (err) => {
          this.logger.error('inputStream', err.message)
          console.log(Date.now(), 'inputStream destroyed', inputStream.destroyed);
          inputStream.destroy();
        });
        inputStream.on("end", () => this.logger.info('inputStream', 'end'));

        setImmediate(async () => {
          for (let i = 0; i <= 20; i++) {

            inputStream.push(JSON.stringify(testData) + '\n');

            await setTimeout(100)
          }

          inputStream.push(null);
        });

        const outputStream = await ctx.call("test-2.stream", inputStream, { timeout: 2000 });

        outputStream.on("data", (data) => this.logger.info('outputStream data'/* , Buffer.from(data).toString() */));
        outputStream.on("error", (err) => this.logger.error('outputStream', err.message));
        outputStream.on("end", () => this.logger.info('outputStream', 'end'));

        return outputStream;
      },
    },
  }
};
