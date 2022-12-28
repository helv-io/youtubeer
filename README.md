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
[
  {
    "id": "TClQ0UcqyzI",
    "type": "youtube",
    "views": 21733,
    "title": "Rebecca Black - Friday - Karaoke Version from Zoom Karaoke",
    "artist": "Zoom Karaoke Official",
    "titleImage": "https://i.ytimg.com/vi/TClQ0UcqyzI/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDxRGLMi_9yBKt4WFjm0EkaNoM7qA",
    "authorImage": "https://yt3.ggpht.com/74WoxbEEAI01vxRH5fnWACZfcZJqayONxX9vJxA-gnesRrb0-YYU86MkUqlmnyoHIU2kX2Xdkg=s68-c-k-c0x00ffffff-no-rj",
    "duration": "3:41",
    "created": "2 years ago"
  },
  {
    "id": "z_mp2ZAOkpc",
    "type": "youtube",
    "views": 5148,
    "title": "Friday - Rebecca Black (Karaoke Version)",
    "artist": "EasyKaraoke",
    "titleImage": "https://i.ytimg.com/vi/z_mp2ZAOkpc/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBp4ZzfjeLbSlI721Jy9lSU2OTCXw",
    "authorImage": "https://yt3.ggpht.com/ytc/AMLnZu_LXKxAzKzgXezb2kzWIUeechpt26wpCXcDGW6K=s68-c-k-c0x00ffffff-no-rj",
    "duration": "3:55",
    "created": "2 years ago"
  }
]
```

### Job:
```
{
  "id": "TClQ0UcqyzI",
  "success": true,
  "status": "Done",
  "requestedOn": "2022-12-28T21:33:17.654Z",
  "name": "Zoom Karaoke Official - Rebecca Black _ Friday _ Karaoke Version from Zoom Karaoke",
  "file": "/media/karaoke/Zoom Karaoke Official - Rebecca Black _ Friday _ Karaoke Version from Zoom Karaoke.mp4"
}
```

## Hints:
- Status can be `Accepted`, `Done` or `Failed`
- If the YouTube download takes longer than `KARAOKE_TIMEOUT`, it will return the `Accepted` status. Otherwise the `Done` or `Failed` status.