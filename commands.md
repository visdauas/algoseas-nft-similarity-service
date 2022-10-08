milvus start:
sudo docker-compose up -d

milvus check:
sudo docker-compose ps

milvus stop:
sudo docker-compose down

milvus delete:
sudo rm -rf  volumes

start attu:
docker run -p 8000:3000  -e MILVUS_URL=localhost:19530 zilliz/attu:latest


indexer create docker:
docker build -t algoseas-indexer .

indexer start docker:
docker run -d algoseas-indexer



