import express from 'express'
import path from 'path'
import { Jobs } from './Job'
import { YTDownload, YTSearch } from './YouTubeHandler'

const app = express()

;(async () => {
  console.log(`
=============
= Youtubeer =
=============

Starting service...`)

  // Routes
  app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '/index.html')))
  app.get('/version', (_req, res) =>
    res
      .status(200)
      .send(
        `${process.env.npm_package_name} ${process.env.npm_package_version}`
      )
  )
  app.get('/youtube/:id', (req, res) => {
    YTDownload(req.params.id, res)
  })
  app.get('/status', (_req, res) => res.json(Jobs).end())
  app.get('/status/:id', (req, res) =>
    res
      .json(Jobs.find((job) => job.id.toString() === req.params.id) || {})
      .end()
  )
  app.get('/search/:query', async (req, res) => {
    const query = req.params.query
    const results = 10
    res.json(await YTSearch(query, results))
  })

  app.listen(3000, async () => {
    console.log('✔ Listening on port 3000!')
  })
})()

process.on('SIGINT', () => process.exit());
