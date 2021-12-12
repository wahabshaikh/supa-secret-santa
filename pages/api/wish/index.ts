import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { roomId, gifteeId, giftName } = body;

        await prisma.wish.create({
          data: {
            roomId: parseInt(roomId),
            gifteeId,
            giftName,
          },
        });

        res.status(200).json({ message: `Successfully created the wish` });
      } catch (error: any) {
        console.error(error);
        res
          .status(500)
          .json({ message: `Error creating the wish: ${error.message}` });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
