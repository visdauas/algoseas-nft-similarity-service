# Algoseas NFT Similarity Service
An algoseas pirates indexer and similarity service using [Milvus](https://github.com/milvus-io/milvus) a state of the art open source vector database


## Try it out at:
https://15.204.8.217:8080/similarity/assetId=920773639/5

(Latency: ~750ms)

Or if you already know the stats of your pirate you can use this alternative faster api, without pirate stat lookup:
https://15.204.8.217:8080/similarity/stats/combat=50/constitution=50/luck=50/plunder=50/5

(Latency: ~500ms)

## Video Demo
[![Alt text](https://img.youtube.com/vi/rhalT2lN2YY/0.jpg)](https://www.youtube.com/watch?v=rhalT2lN2YY)

## Overview
This project is split into 2 docker containers.
- **Indexer**: this project takes care of indexing, monitoring and storing all pirate nfts in the vector database, it also monitors pirate sales
- **Service**: this project searches the vector database in various ways and returns the results

## Requirements

This service uses Milvus Cluster(Standalone doesn't support authentication)

https://milvus.io/docs/v2.1.x/install_cluster-docker.md

Important: Milvus doesn't run on AMD cpus

https://milvus.io/docs/v2.1.x/prerequisite-docker.md

There is an example Milvus Cluster preconfigured in /milvus-example
You can start it with

```
cd milvus-example
sudo docker compose up -d
```

## How to run?

First clone this repository
```
git clone https://github.com/visdauas/algoseas-nft-similarity-service

```

Rename the .env.example files in both projects to .env

Than set the ip address of your Milvus Cluster in both of the .env files

Finally you can start the indexer and service with:
```
sudo docker compose up -d
```

## How does it work?

### Indexer

- Built with Typescript and Node.js
- Initial index takes about 10 minutes
- Pirate data is updated every round(Algorand block time: ~3.7sec)
- You can adjust the importance of stats with weights(We recommend using even weights because floats mess up the search results)
- It also speeds up searches by indexing the vector database with the ANNOY algorithm


### Service

- Uses Fastify which is lightweight and lightning fast
- Conducts vector similarity search on the given inputs and returns similar listings and sales
