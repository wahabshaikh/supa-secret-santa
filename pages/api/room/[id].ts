import { Tag } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export type RoomData = {
  name: string;
  tag: Tag;
  members: {
    user: {
      id: string;
      avatarUrl: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    isApproved: boolean;
  }[];
} | null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoomData>
) {
  const { method, query } = req;

  switch (method) {
    case "GET":
      try {
        const { id } = query as { id: string };

        const roomData = await prisma.room.findUnique({
          where: { id: parseInt(id) },
          select: {
            name: true,
            tag: true,
            members: {
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
            },
          },
        });

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
