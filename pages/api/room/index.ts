import type { NextApiRequest, NextApiResponse } from "next";
import {} from "@prisma/client";
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
        const { creatorId, name, tag } = body;

        await prisma.room.create({
          data: {
            name,
            tag,
            creatorId,
          },
        });

        res.status(200).json({ message: `Successfully created the room` });
      } catch (error: any) {
        console.error(error);
        res
          .status(500)
          .json({ message: `Error creating the room: ${error.message}` });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
