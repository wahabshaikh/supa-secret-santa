import { Room, Wish, User as Profile } from "@prisma/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
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

  const [giftName, setGiftName] = useState("");
  const [giftUrl, setGiftUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
  }, [wishes, members, user.id]);

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
      giftName,
      giftUrl,
      gifteeId: user.id,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    setIsLoading(false);
    setGiftName("");
    setGiftUrl("");
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

      <div className="bg-white shadow md:rounded-lg">
        <div className="flex items-center justify-between px-4 py-5 md:p-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-heading text-gray-800 md:text-3xl mb-2">
              {room.name}
            </h1>
            <Badge colors="bg-green-100 text-green-800">{room.tag}</Badge>
          </div>
          <div>
            {room.creatorId === user.id && (
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                onClick={() => setOpen(!open)}
              >
                Invite
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Create Wish */}
          {!wishes.find((wish) => wish.gifteeId === user.id) && (
            <div className="bg-white shadow md:rounded-lg">
              <div className="px-4 py-5 md:p-6">
                <h1>Make a wish</h1>
                <form
                  className="mt-5 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    createWish();
                  }}
                >
                  <div className="w-full">
                    <label htmlFor="giftName" className="sr-only">
                      Gift Name
                    </label>
                    <input
                      type="text"
                      name="giftName"
                      id="giftName"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full md:text-sm border-gray-300 rounded-md"
                      placeholder="Gift Name"
                      required
                      value={giftName}
                      onChange={(event) => setGiftName(event.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="giftUrl" className="sr-only">
                      Gift URL
                    </label>
                    <input
                      type="text"
                      name="giftUrl"
                      id="giftUrl"
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full md:text-sm border-gray-300 rounded-md"
                      placeholder="Gift URL"
                      required
                      value={giftUrl}
                      onChange={(event) => setGiftUrl(event.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-5 bg-green-600 hover:bg-green-700 focus:ring-green-500 md:mt-0 md:w-auto md:text-sm"
                  >
                    Share
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* List */}
          <ul className="md:col-span-1 space-y-4">
            {wishes.map((wish) => (
              <li key={wish.id} className="bg-white shadow md:rounded-lg">
                <div className="md:flex md:justify-between md:items-center px-4 py-5 md:p-6">
                  <a
                    href={wish.giftUrl}
                    className="flex-1 font-semibold underline"
                  >
                    {wish.giftName}
                  </a>
                  {!wish.santaId && wish.gifteeId !== user.id && (
                    <Button
                      type="submit"
                      className="mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                      onClick={() => becomeSanta(wish.id)}
                    >
                      Gift 🎁
                    </Button>
                  )}
                  {wish.santaId === user.id && (
                    <Button
                      type="submit"
                      className="mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                      onClick={() => setModalOpen(true)}
                    >
                      See address
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Members */}
        <div className="md:col-span-1 bg-white shadow md:rounded-lg">
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
                      {/* Badges */}
                      {member.id === room.creatorId && (
                        <Badge colors="bg-green-100 text-green-800">
                          Admin
                        </Badge>
                      )}
                      {!member.isApproved && (
                        <Badge colors="bg-red-100 text-red-800">Pending</Badge>
                      )}
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
