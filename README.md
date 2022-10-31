# Algoseas NFT Similarity Service with Vector Database

Try it out at:
https://15.204.8.217:8080/similarity/assetId=920773639/5

Or if you already know the stats of your pirate you can use this alternative faster api, without pirate stat lookup:
https://15.204.8.217:8080/similarity/stats/combat=50/constitution=50/luck=50/plunder=50/5

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

Finally you can start the indexer and service with:
```
docker compose up -d
```

## How does it work?




