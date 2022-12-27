FROM node:latest
WORKDIR /usr/src/app
RUN apt update && apt install -y ffmpeg && rm -rf /var/lib/apt/lists/*
ADD src package*.json /usr/src/app/
RUN npm install --omit=dev
EXPOSE 3000
ENTRYPOINT ["npx","tsx","index.ts"]
