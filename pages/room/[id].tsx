import { Room, Wish } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import supabase from "../../lib/supabase";

interface IRoom {
  user: User;
}

const members = [
  {
    name: "Emily Selman",
    email: "emilyselman@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Kristin Watson",
    email: "kristinwatson@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Emma Dorsey",
    email: "emmadorsey@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    email: "floydmiles@example.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

const Room: NextPage<IRoom> = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    getWishes();
  }, []);

  async function createWish() {
    await toast.promise(
      axios.post("/api/wish", {
        roomId: id,
        gifteeId: user.id,
        giftName: wish,
      }),
      {
        loading: "Creating a wish...",
        success: (response) => response.data.message,
        error: (error) => error.toString(),
      }
    );
  }

  async function getWishes() {
    const { data } = (await supabase
      .from("Wish")
      .select()
      .filter("roomId", "eq", id)) as { data: Wish[] };

    setWishes(data);
  }

  return (
    <>
      <Head>
        <title>Room {id} | Supa Secret Santa</title>
      </Head>

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 md:text-3xl md:truncate">
            Room {id}
          </h2>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Invite
          </button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Create Wish */}
          <div className="bg-white shadow md:rounded-lg">
            <div className="px-4 py-5 md:p-6">
              <form
                className="mt-5 md:flex md:items-center"
                onSubmit={(event) => {
                  event.preventDefault();
                  createWish();
                }}
              >
                <div className="w-full">
                  <label htmlFor="email" className="sr-only">
                    Wish
                  </label>
                  <input
                    type="text"
                    name="wish"
                    id="wish"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full md:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your wish..."
                    required
                    value={wish}
                    onChange={(event) => setWish(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                >
                  Share
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <ul className="mt-4 md:col-span-1 space-y-4">
            {wishes.map((wish) => (
              <li key={wish.id} className="bg-white shadow md:rounded-lg">
                <div className="md:flex md:justify-between md:items-center px-4 py-5 md:p-6">
                  <p className="flex-1">{wish.giftName}</p>
                  <button
                    type="submit"
                    className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                  >
                    Gift 🎁
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Members */}
        <div className="hidden md:block md:col-span-1 bg-white shadow md:rounded-lg">
          <div className="p-6">
            <div className="bg-white py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Members
              </h3>
            </div>
            <div className="flow-root mt-6">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {members.map((member) => (
                  <li key={member.email} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={member.avatarUrl}
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                      <div>
                        <a
                          href="#"
                          className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Approve
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { user } };
};

export default Room;
