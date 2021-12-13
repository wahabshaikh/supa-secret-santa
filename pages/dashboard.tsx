import { Room } from "@prisma/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CalendarIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import prisma from "../lib/prisma";
import supabase from "../lib/supabase";
import CreateRoomOverlay from "../components/CreateRoomOverlay";
import Badge from "../components/Badge";

interface IDashboard {
  user: User;
}

const Dashboard: NextPage<IDashboard> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<(Room & { isApproved: boolean })[]>([]);

  useEffect(() => {
    fetchRooms();

    const mySubscription = supabase
      .from("UsersInRooms")
      .on("*", () => {
        fetchRooms();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  async function fetchRooms() {
    const { data, error } = (await supabase
      .from("UsersInRooms")
      .select("isApproved, Room(*)")
      .filter("userId", "eq", user.id)) as PostgrestResponse<{
      isApproved: boolean;
      Room: Room;
    }>;

    if (error) toast.error(error.message);

    const rooms = data?.map(({ isApproved, Room }) => ({
      isApproved,
      ...Room,
    }));

    setRooms(rooms || []);
  }

  async function acceptInvitation(roomId: number, userId: string) {
    const { error } = await supabase
      .from("UsersInRooms")
      .update({ isApproved: true })
      .eq("roomId", roomId)
      .eq("userId", userId);

    if (error) toast.error(error.message);
  }

  return (
    <>
      <Head>
        <title>Dashboard | Supa Secret Santa</title>
      </Head>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Rooms
              </h2>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setOpen(!open)}
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create Room
              </button>
            </div>
          </div>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {rooms.map((room) => (
            <li key={room.id}>
              <Link href={`room/${room.id}`}>
                <a className="block hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="truncate">
                        {/* Room details */}
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">
                            {room.name}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            of {room.tag}
                          </p>
                        </div>
                        {/* Timestamp */}
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <p>
                              Created on{" "}
                              {new Date(room.createdAt).toDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        {/* Creator badge */}
                        {room.creatorId === user.id && (
                          <Badge colors="bg-green-100 text-green-800">
                            Creator
                          </Badge>
                        )}
                        {/* Accept invitation button */}
                        {!room.isApproved && (
                          <button
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => acceptInvitation(room.id, user.id)}
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      <CreateRoomOverlay creatorId={user.id} open={open} setOpen={setOpen} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Redirect unautheticated user to dashboard
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // Redirect new user to profile page
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!profile) {
    return { redirect: { destination: "/profile", permanent: false } };
  }

  return { props: { user } };
};

export default Dashboard;
