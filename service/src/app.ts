import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import autoload from "@fastify/autoload";
import fastifyNoIcon from "fastify-no-icon";
import path from "path";
import { userSchema } from "./schemas/user";
import { errorSchema } from "./schemas/error";
import { assetIdsSchema } from "./schemas/assetIds";
import milvusPlugin from "./database/milvus";
import fp from "fastify-plugin";

interface buildOpts extends FastifyServerOptions {
  exposeDocs?: boolean;
}

const build = (opts: buildOpts = {}): FastifyInstance => {
  const app = fastify(opts);
  
  // add in common schemas
  app.addSchema(assetIdsSchema)
  app.addSchema(userSchema);
  app.addSchema(errorSchema);

  app.register(fp(milvusPlugin), {
    url: "localhost:19530",
    collectionName: "algoseas_pirates",
    });
  app.register(fastifyNoIcon);

  app.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });

  return app;
};

export default build;
