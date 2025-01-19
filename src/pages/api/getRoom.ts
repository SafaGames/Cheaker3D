import { MongoClient } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    res.status(500).send({ error: `MongoDB URI is not defined` })
    return
  }

  if (req.method === `GET`) {
    try {
      const client = new MongoClient(uri)
      await client.connect()

      const db = client.db(`chess3D`)
      const collection = db.collection(`room`)

      const { gameSessionUuid } = req.query

      const data = await collection.findOne({ gameSessionUuid })

      await client.close()

      res.status(200).json(data)
    } catch (err) {
      console.error(`Error fetching data from MongoDB:`, err)
      res.status(500).send({ error: `Failed to fetch data from MongoDB` })
    }
  } else {
    res.status(500).send({ error: `Wrong method called` })
  }
}
