FROM alpine:latest
RUN apk add --update npm ffmpeg
WORKDIR /usr/src/app
ADD src package*.json /usr/src/app/
RUN npm install --omit=dev
EXPOSE 3000
ENTRYPOINT ["npx","tsx","index.ts"]
