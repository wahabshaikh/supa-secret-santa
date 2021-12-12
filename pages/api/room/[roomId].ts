import { User, UsersInRooms } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export type Members = (Partial<UsersInRooms> & { user: Partial<User> })[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Members>
) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const { roomId } = query as { roomId: string };

        const members = await prisma.usersInRooms.findMany({
          where: { roomId: parseInt(roomId) },
          select: {
            user: {
              select: {
                id: true,
                avatarUrl: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            isApproved: true,
          },
        });

        res.status(200).json(members);
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
