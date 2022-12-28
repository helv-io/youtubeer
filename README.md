# YouTubeer

### YouTubeer is an API to download Karaoke songs from YouTube and save them as MP4 files.

[![Build Status](https://jenkins.helv.io/buildStatus/icon?job=helvio%2Fyoutubeer)](https://jenkins.helv.io/job/helvio/job/youtubeer/)

## Requirements

- **Docker** [Official Installation Docs](https://docs.docker.com/engine/install/)

## Installation

- `docker run -d --name youtubeer -v /home/user/karaoke:/media/karaoke -p 3000:3000 helvio/youtubeer`

## Environment Vars

| Variable         | Description                      | Default        |
| ---------------- | -------------------------------- | -------------- |
| KARAOKE_OUTPUT   | Folder to save Karaoke files     | /media/karaoke |
| KARAOKE_TIMEOUT  | Timeout (s) to return a request  | 10             |

Don't forget the volume mountpoint!

## API

| Path            | Description                  | Returns            | Type          |
| --------------- | ---------------------------- | ------------------ | ------------- |
| /               | HTML API tester              | `text/html`        | HTML          |
| /version        | Version information          | `text/plain`       | Text          |
| /status         | All jobs status information  | `application/json` | Job[]         |
| /status/{id}    | Job status information       | `application/json` | Job           |
| /youtube/{id}   | Perform YouTube request      | `application/json` | Job           |
| /search/{query} | Perform YouTube search       | `application/json` | SearchResult  |

## Examples

### SearchResult:
```
{
    "id": "oavMtUWDBTM",
    "type": "youtube",
    "views": 38000000,
    "title": "Mr. Trololo original upload",
    "artist": "RealPapaPit",
    "titleImage": "some-url",
    "authorImage": "some-url",
    "duration": "2:42",
    "created": "13 years ago"
}
```

### Job:
```
{
  "id": "oavMtUWDBTM",
  "success": true,
  "status": "Done",
  "requestedOn": "2022-12-28T21:26:29.161Z",
  "name": "RealPapaPit - Mr. Trololo original upload",
  "file": "/media/karaoke/RealPapaPit - Mr. Trololo original upload.mp4"
}
```

## Hints:
- Status can be `Accepted`, `Done` or `Failed`
- If the YouTube download takes longer than `KARAOKE_TIMEOUT`, it will return the `Accepted` status. Otherwise the `Done` or `Failed` status.