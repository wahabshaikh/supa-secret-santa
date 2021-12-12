import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import supabase from "../lib/supabase";
import { CalendarIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";
import CreateRoomOverlay from "../components/CreateRoomOverlay";
import { useState } from "react";

const rooms = [
  {
    id: 1,
    title: "Room 1",
    tag: "Family",
    createdAt: "December 12, 2021",
    members: [
      {
        name: "Emily Selman",
        email: "emilyselman@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Kristin Watson",
        email: "kristinwatson@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Emma Dorsey",
        email: "emmadorsey@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Floyd Miles",
        email: "floydmiles@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  },
  {
    id: 2,
    title: "Room 2",
    tag: "Friends",
    createdAt: "December 13, 2021",
    members: [
      {
        name: "Kristin Watson",
        email: "kristinwatson@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Emma Dorsey",
        email: "emmadorsey@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Floyd Miles",
        email: "floydmiles@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  },
  {
    id: 3,
    title: "Room 3",
    tag: "Coworkers",
    createdAt: "December 14, 2021",
    members: [
      {
        name: "Emily Selman",
        email: "emilyselman@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Kristin Watson",
        email: "kristinwatson@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        name: "Emma Dorsey",
        email: "emmadorsey@example.com",
        imageUrl:
          "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ],
  },
];

interface IDashboard {
  user: User;
}

const Dashboard: NextPage<IDashboard> = ({ user }) => {
  const [open, setOpen] = useState(false);

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
                            {room.title}
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
                              <time dateTime={room.createdAt}>
                                {room.createdAt}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex overflow-hidden -space-x-1">
                          {room.members.map((applicant) => (
                            <img
                              key={applicant.email}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                              src={applicant.imageUrl}
                              alt={applicant.name}
                            />
                          ))}
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
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/login", permanent: false },
    };
  }

  return { props: { user } };
};

export default Dashboard;
