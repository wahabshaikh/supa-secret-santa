import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

type Data = User | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const {
          id,
          avatarUrl,
          firstName,
          lastName,
          email,
          street,
          city,
          region,
          country,
          postalCode,
        } = body;

        await prisma.user.create({
          data: {
            id,
            avatarUrl,
            firstName,
            lastName,
            email,
            street,
            city,
            region,
            country,
            postalCode,
          },
        });

        res.status(200).json({ message: `Successfully created the profile` });
      } catch (error: any) {
        console.error(error);
        res
          .status(500)
          .json({ message: `Error creating the profile: ${error.message}` });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
