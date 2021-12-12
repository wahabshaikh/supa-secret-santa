import { Room } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import supabase from "../lib/supabase";
import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import CreateRoomOverlay from "../components/CreateRoomOverlay";
import { useEffect, useState } from "react";

interface IDashboard {
  user: User;
}

const Dashboard: NextPage<IDashboard> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms();

    // // Not working for some reason
    // const mySubscription = supabase
    //   .from("Room")
    //   .on("*", () => fetchRooms())
    //   .subscribe();

    // return () => {
    //   supabase.removeSubscription(mySubscription);
    // };
  }, []);

  async function fetchRooms() {
    const { data } = (await supabase
      .from("Room")
      .select()
      .filter("creatorId", "eq", user.id)) as { data: Room[] };

    setRooms(data);
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
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setOpen(!open)}
              >
                Create new room
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
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">
                            {room.name}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            of {room.tag}
                          </p>
                        </div>
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
                        <div className="flex overflow-hidden -space-x-1">
                          {/* {room.members.map((applicant) => (
                            <img
                              key={applicant.email}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              src={applicant.imageUrl}
                              alt={applicant.name}
                            />
                          ))} */}
                        </div>
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
      <CreateRoomOverlay creatorId={user.id} open={open} setOpen={setOpen} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Check for authenticated user
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // Check if new user
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!profile) {
    return { redirect: { destination: "/profile", permanent: false } };
  }

  return { props: { user } };
};

export default Dashboard;
