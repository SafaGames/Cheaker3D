import { MongoClient, MongoClientOptions } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const uri = process.env.MONGODB_URI

  interface Player {
    name: string
    uuid: string
    profileImage: string
    ready: string
    color?: string
  }

  if (!uri) {
    res.status(500).send({ error: `MongoDB URI is not defined` })
    return
  }

  if (req.method === `POST`) {
    try {
      const client = new MongoClient(uri)
      const response = { status: false, message: ``, payload: {} }

      await client.connect()

      const db = client.db(`chess3D`)
      const collection = db.collection(`room`)

      const dataToAdd = req.body

      const assignColorsToPlayers = (players: Player[]): Player[] => {
        const colors = [`black`, `white`]
        // Shuffle colors array
        colors.sort(() => Math.random() - 0.5)
        // Assign colors to players
        return players.map((player, index) => ({
          ...player,
          color: colors[index % colors.length],
        }))
      }

      const modifiedData = {
        gameSessionUuid: dataToAdd.room.gameSessionUuid,
        name: dataToAdd.room.name,
        players: assignColorsToPlayers(dataToAdd.players),
        cleatedDate: new Date(),
      }

      const existingRoom = await collection.findOne({
        gameSessionUuid: modifiedData.gameSessionUuid,
      })

      if (dataToAdd.players.length > 2) {
        response.message = `Only two players cn be added!`
        return res.status(400).json(response)
      }

      if (existingRoom) {
        response.message = `Request ID already exists`
        return res.status(400).json(response)
      }

      const result = await collection.insertOne(modifiedData)
      await client.close()

      if (result.acknowledged) {
        response.status = true
        response.message = `success`
        response.payload = {
          gameSessionUuid: modifiedData.gameSessionUuid,
          gameStateId: result.insertedId,
          name: modifiedData.gameSessionUuid,
          createDate: modifiedData.cleatedDate,
          link1: `http://localhost:3000/?gameSessionUuid=${modifiedData.gameSessionUuid}&gameStateId=${result.insertedId}&uuid=${modifiedData.players[0].uuid}`,
        }
      }

      res.status(200).json(response)
    } catch (err) {
      console.error(`Error adding data to MongoDB:`, err)
      const response = { status: false, message: `Failed to create room` }
      res.status(500).json(response)
    }
  } else {
    res.status(500).send({ error: `wrong method called` })
  }
}
