import exec from '@simplyhexagonal/exec'
import { Response } from 'express'
import fs from 'fs/promises'
import path from 'path'
import streamToPromise from 'stream-to-promise'
import ytdl from 'ytdl-core'
import YouTubeSearch, { Video } from 'ytsr'
import { Job, Jobs } from './Job'
import sanitize from 'sanitize-filename'
import * as os from 'os'

export const YTSearch = async (query: string, maxResults: number) => {
  try {
    const results = await YouTubeSearch(`${query} karaoke`, { limit: 50 })
    return results.items
      .filter((item) => item.type === 'video' && !item.isLive)
      .slice(0, maxResults)
      .map((item) => {
        item = <Video>item
        return {
          id: item.id,
          type: 'youtube',
          views: item.views,
          title: item.title,
          artist: item.author?.name || 'No Author',
          titleImage: item.bestThumbnail?.url || null,
          authorImage: item.author?.bestAvatar?.url || null,
          duration: item.duration,
          created: item.uploadedAt
        }
      })
  } catch (error) {
    console.error(error)
  }
}

export const YTDownload = async (id: string, res: Response) => {
  // Avoid processing same ID
  if (Jobs.find((j) => j.id === id)) {
    res.redirect(`/status/${id}`)
    return
  }

  // Create a job and proceed
  const job = new Job(id)
  try {
    const youtube = await ytdl.getInfo(id)
    if (!youtube) {
      res.end(`YouTube ID ${id} not found`)
    }
  
    // Create all variables and sanitize them
    const output: string = process.env.KARAOKE_OUTPUT || '/media/karaoke'
    const artist = sanitize(youtube.player_response.videoDetails.author, { replacement: '_' }).replaceAll('-', '_')
    const song = sanitize(youtube.player_response.videoDetails.title, { replacement: '_' }).replaceAll('-', '_')
    const videoFile = path.join(os.tmpdir(), `${artist} - ${song}.mov`)
    const audioFile = path.join(os.tmpdir(), `${artist} - ${song}.webm`)
    const karaokeFile = path.join(output, `${artist} - ${song}.mp4`)
    let timeout = false

    // Push Job instance and return to browser
    job.name = `${artist} - ${song}`
    Jobs.push(job)

    // Set a timeout in case the processing is not finished
    setTimeout(() => {
      timeout = true
      if (!job.success) { res.redirect(`/status/${id}`) }
    }, 10000)

    // Download and join files
    console.log('Downloading Video')
    await fs.writeFile(
      videoFile,
      await streamToPromise(
        ytdl(id, { quality: 'highest', filter: 'videoonly' })
      )
    )
    console.log('Downloading Audio')
    await fs.writeFile(
      audioFile,
      await streamToPromise(
        ytdl(id, { quality: 'highest', filter: 'audioonly' })
      )
    )
    console.log('Joining Video and Audio tracks')
    const cmd = `ffmpeg \
                    -i "${videoFile}" \
                    -i "${audioFile}" \
                    -map 0:v -map 1:a \
                    -map_metadata -1 \
                    -metadata:s:a:0 Title=Instruments \
                    -c:v copy -c:a aac \
                    -y "${karaokeFile}"`
    await exec(cmd).execPromise

    // Cleanup
    await fs.unlink(videoFile)
    await fs.unlink(audioFile)

    // Mark job as successful and add metadata
    console.log('Done!')
    console.log(karaokeFile)
    job.success = true
    job.status = 'Done'
    job.file = karaokeFile

    // Redirect to status page
    if (!timeout) { res.json(job).end() }
  } catch (error) {
    console.error(error)
    res.status(500).json(error).end()
  }
}
