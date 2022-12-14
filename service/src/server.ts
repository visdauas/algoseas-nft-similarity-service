import {
  FastifyInstance,
  FastifyListenOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
} from "fastify";
import build from "./app";
import fs from "fs";
import path from "path";
import http2 from "http2";

import * as dotenv from "dotenv";
dotenv.config();

const options: FastifyListenOptions = {
  port: parseInt(process.env.PORT!),
  host: "0.0.0.0",
};

async function main() {
  const app: FastifyInstance<
    http2.Http2SecureServer,
    RawRequestDefaultExpression<http2.Http2SecureServer>,
    RawReplyDefaultExpression<http2.Http2SecureServer>
  > = build({
    http2: true,
    https: {
      allowHTTP1: true,
      key: fs.readFileSync(path.resolve("cert", "./key.pem")),
      cert: fs.readFileSync(path.resolve("cert", "./cert.pem")),
    },
    logger: {},
  });

  app.listen(options, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
