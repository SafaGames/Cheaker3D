import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === `POST`) {
    console.log(req.body)
    try {
      await axios.post(
        process.env.SAFA_BACKEND_URL +
          `/api/external_game/v1/game_session_finish`,
        req.body,
      )
      res.status(200).json({ message: `Winner data sent successfully` })
    } catch (error) {
      console.error(`Error sending winner data:`, error)
      res.status(500).send({ error: `Failed to send winner data` })
    }
  } else {
    res.status(500).send({ error: `Wrong method called` })
  }
}
