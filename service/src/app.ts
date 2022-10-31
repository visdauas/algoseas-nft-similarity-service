import fastify, {
  FastifyBaseLogger,
  FastifyHttp2SecureOptions,
} from "fastify";
import autoload from "@fastify/autoload";
import fastifyNoIcon from "fastify-no-icon";
import path from "path";
import { userSchema } from "./schemas/user";
import { errorSchema } from "./schemas/error";
import { assetIdsSchema } from "./schemas/assetIds";
import milvusPlugin from "./database/milvus";
import weightsPlugin from "./database/weights";
import fp from "fastify-plugin";
import http2 from "http2";

import * as dotenv from "dotenv";
dotenv.config();

const build = (
  opts: FastifyHttp2SecureOptions<http2.Http2SecureServer, FastifyBaseLogger>
) => {
  const app = fastify(opts);

  // add in common schemas
  app.addSchema(assetIdsSchema);
  app.addSchema(userSchema);
  app.addSchema(errorSchema);

  app.register(fp(milvusPlugin), {
    url: process.env.MILVUS_URL!,
    collectionName: process.env.MILVUS_COLLECTION_NAME!,
    user: process.env.MILVUS_USER!,
    password: process.env.MILVUS_PASSWORD!,
  });

  app.register(fp(weightsPlugin), {
    combatWeight: parseFloat(process.env.PIRATE_COMBAT_WEIGHT!),
    constitutionWeight: parseFloat(process.env.PIRATE_CONSTITUTION_WEIGHT!),
    luckWeight: parseFloat(process.env.PIRATE_LUCK_WEIGHT!),
    plunderWeight: parseFloat(process.env.PIRATE_PLUNDER_WEIGHT!),
  });

  app.register(fastifyNoIcon);

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });

  return app;
};

export default build;
