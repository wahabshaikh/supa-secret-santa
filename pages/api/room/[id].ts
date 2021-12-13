import { Room } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Room>
) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const { id } = query as { id: string };
        const roomId = parseInt(id);

        const roomData = await prisma.room.findUnique({
          where: { id: roomId },
        });

        if (!roomData) {
          res.status(404).end(`Not found`);
          return;
        }

        res.status(200).json(roomData);
      } catch (error: any) {
        console.error(error);
        res
          .status(500)
          .end({ message: `Error creating the room: ${error.message}` });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
