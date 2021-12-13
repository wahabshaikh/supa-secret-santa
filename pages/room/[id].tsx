import { Room, Wish, User as Profile } from "@prisma/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InviteMemberOverlay from "../../components/InviteMemberOverlay";
import ShippingAddressModal from "../../components/ShippingAddressModal";
import prisma from "../../lib/prisma";
import supabase from "../../lib/supabase";

interface IRoom {
  user: User;
  roomData: string;
}

const Room: NextPage<IRoom> = ({ user, roomData }) => {
  const room: Room = JSON.parse(roomData);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [wish, setWish] = useState("");
  const [members, setMembers] = useState<(Profile & { isApproved: boolean })[]>(
    []
  );
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [giftee, setGiftee] = useState<
    (Profile & { isApproved: boolean }) | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchWishes();

    const mySubscription = supabase
      .from("*")
      .on("*", () => {
        fetchMembers();
        fetchWishes();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  useEffect(() => {
    const gifteeId = wishes.find((wish) => wish.santaId === user.id)?.gifteeId;
    const giftee = members.find((member) => member.id === gifteeId);

    if (!giftee) return;

    setGiftee(giftee);
  }, [wishes, user.id]);

  async function fetchMembers() {
    const { data, error } = (await supabase
      .from("UsersInRooms")
      .select("isApproved, User(*)")
      .filter("roomId", "eq", room.id)) as PostgrestResponse<{
      isApproved: boolean;
      User: Profile;
    }>;

    if (error) toast.error(error.message);

    const members = data?.map(({ isApproved, User }) => ({
      isApproved,
      ...User,
    }));

    setMembers(members || []);
  }

  async function createWish() {
    setIsLoading(true);
    if (isLoading) toast.loading("Sharing your wish...");

    const { error } = await supabase.from("Wish").insert({
      roomId: room.id,
      giftName: wish,
      gifteeId: user.id,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    setIsLoading(false);
    setWish("");
    toast.success("Successfully shared your wish");

    // await toast.promise(
    //   axios.post("/api/wish", {
    //     roomId: room.id,
    //     gifteeId: user.id,
    //     wish,
    //   }),
    //   {
    //     loading: "Creating a wish...",
    //     success: (response) => response.data.message,
    //     error: (error) => error.toString(),
    //   }
    // );
  }

  async function becomeSanta(wishId: number) {
    await supabase
      .from("Wish")
      .update({ santaId: user.id, acceptedAt: new Date().toISOString() })
      .eq("id", wishId);
  }

  async function fetchWishes() {
    const { data } = (await supabase
      .from("Wish")
      .select()
      .filter("roomId", "eq", room.id)) as PostgrestResponse<Wish>;

    setWishes(data || []);
  }

  return (
    <>
      <Head>
        <title>{room.name} | Supa Secret Santa</title>
      </Head>

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 md:text-3xl md:truncate">
            {room.name}
          </h2>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setOpen(!open)}
          >
            Invite
          </button>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Create Wish */}
          {!wishes.find((wish) => wish.gifteeId === user.id) && (
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
          )}

          {/* List */}
          <ul className="mt-4 md:col-span-1 space-y-4">
            {wishes.map((wish) => (
              <li key={wish.id} className="bg-white shadow md:rounded-lg">
                <div className="md:flex md:justify-between md:items-center px-4 py-5 md:p-6">
                  <p className="flex-1">{wish.giftName}</p>
                  {!wish.santaId && wish.gifteeId !== user.id && (
                    <button
                      type="submit"
                      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                      onClick={() => becomeSanta(wish.id)}
                    >
                      Gift 🎁
                    </button>
                  )}
                  {wish.santaId === user.id && (
                    <button
                      type="submit"
                      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                      onClick={() => setModalOpen(true)}
                    >
                      See address
                    </button>
                  )}
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
                  <li key={member.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={member.avatarUrl}
                          alt={member.firstName}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {`${member.firstName} ${member.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <InviteMemberOverlay roomId={room.id} open={open} setOpen={setOpen} />
      <ShippingAddressModal
        open={modalOpen}
        setOpen={setModalOpen}
        address={{
          street: giftee?.street,
          city: giftee?.city,
          region: giftee?.region,
          country: giftee?.country,
          postalCode: giftee?.postalCode,
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  // Redirect unautheticated user to login
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // Fetch room data
  const id = params?.id as string;
  const roomId = parseInt(id);
  const roomData = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!roomData) {
    return { notFound: true };
  }

  return { props: { user, roomData: JSON.stringify(roomData) } };
};

export default Room;
