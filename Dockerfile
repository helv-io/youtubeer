FROM node:alpine
RUN apk add --update ffmpeg
WORKDIR /usr/src/app
ADD ["tmp/dist.js", "src/index.html", "/usr/src/app/"]
EXPOSE 3000
ENTRYPOINT ["node","dist.js"]
