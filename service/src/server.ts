import { FastifyInstance, FastifyListenOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./app";

const loggerConfig = {
  prettyPrint: true,
};
let exposeDocs = true;
if (process.env.NODE_ENV === "production") {
  loggerConfig.prettyPrint = false;
  exposeDocs = true;
}

const options: FastifyListenOptions = {
  port: 8080,
  host: "0.0.0.0",
};

async function main() {
  const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    logger: {},
    exposeDocs,
  });

  //await app.ready();

  app.listen(options, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
