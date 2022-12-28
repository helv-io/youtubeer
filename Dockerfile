FROM alpine:latest
RUN apk add --update npm ffmpeg
WORKDIR /usr/src/app
ADD src package*.json /usr/src/app/
RUN npm install --omit=dev && chmod 777 /usr/src/app/node_modules/content-type -R
EXPOSE 3000
ENTRYPOINT ["npx","tsx","index.ts"]
