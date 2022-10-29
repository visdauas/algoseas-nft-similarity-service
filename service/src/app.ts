import fastify, { FastifyBaseLogger, FastifyHttp2SecureOptions, FastifyInstance, FastifyServerOptions } from "fastify";
import autoload from "@fastify/autoload";
import fastifyNoIcon from "fastify-no-icon";
import path from "path";
import { userSchema } from "./schemas/user";
import { errorSchema } from "./schemas/error";
import { assetIdsSchema } from "./schemas/assetIds";
import milvusPlugin from "./database/milvus";
import fp from "fastify-plugin";
import http2 from "http2";
import httpsRedirect from "fastify-https-redirect";

import * as dotenv from "dotenv";
dotenv.config();


const build = (opts: FastifyHttp2SecureOptions<http2.Http2SecureServer, FastifyBaseLogger>) => {
  const app = fastify(opts);
  //app.register(httpsRedirect, {httpPort:1080});

  // add in common schemas
  app.addSchema(assetIdsSchema);
  app.addSchema(userSchema);
  app.addSchema(errorSchema);

  const url = process.env.MILVUS_URL!;
  const collectionName = process.env.MILVUS_COLLECTION_NAME!;
  const user = process.env.MILVUS_USER!;
  const password = process.env.MILVUS_PASSWORD!;

  app.register(fp(milvusPlugin), {
    url: url,
    collectionName: collectionName,
    user: user,
    password: password,
  });

  app.register(fastifyNoIcon);

  app.register(httpsRedirect,{httpPort:8080, httpsPort:8000});

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });

  return app;
};

export default build;
