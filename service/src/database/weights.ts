import { FastifyInstance } from "fastify";

export interface WeightsOptions {
  combatWeight: number;
  constitutionWeight: number;
  luckWeight: number;
  plunderWeight: number;
}

interface Weights {
  combatWeight: number;
  constitutionWeight: number;
  luckWeight: number;
  plunderWeight: number;
}

declare module "fastify" {
  interface FastifyInstance {
    weights: Weights;
  }
}

const weightsPlugin = async (
  fastify: FastifyInstance,
  options: WeightsOptions
): Promise<void> => {
  fastify.decorate("weights", {
    combatWeight: options.combatWeight,
    constitutionWeight: options.constitutionWeight,
    luckWeight: options.luckWeight,
    plunderWeight: options.plunderWeight,
  });
};

export default weightsPlugin;
