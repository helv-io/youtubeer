FROM alpine:latest
RUN apk add --update npm ffmpeg
WORKDIR /usr/src/app
ADD src package*.json /usr/src/app/
RUN npm install --omit=dev && rm /usr/src/app/node_modules/content-type/*.md && rm /usr/src/app/node_modules/content-type/LICENSE
EXPOSE 3000
ENTRYPOINT ["npx","tsx","index.ts"]
