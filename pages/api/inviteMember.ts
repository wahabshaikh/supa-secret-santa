import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { email, roomId } = body as { email: string; roomId: number };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          res.status(404).json({ message: `User not found` });
          return;
        }

        await prisma.usersInRooms.create({
          data: { roomId, userId: user.id },
        });

        res.status(200).json({ message: `Successfully invited to the room` });
      } catch (error: any) {
        console.error(error);
        res
          .status(500)
          .json({ message: `Error inviting to the room: ${error.message}` });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
