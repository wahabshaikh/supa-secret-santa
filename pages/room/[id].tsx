import { Room, Wish, User as Profile } from "@prisma/client";
import { PostgrestResponse, User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Card from "../../components/Card";
import CreateWish from "../../components/CreateWish";
import InviteMemberOverlay from "../../components/InviteMemberOverlay";
import ShippingAddressModal from "../../components/ShippingAddressModal";
import prisma from "../../lib/prisma";
import supabase from "../../lib/supabase";

interface RoomProps {
  user: User;
  roomData: string;
}

const Room: NextPage<RoomProps> = ({ user, roomData }) => {
  const room: Room = JSON.parse(roomData);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState<(Profile & { isApproved: boolean })[]>(
    []
  );
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [giftee, setGiftee] = useState<
    (Profile & { isApproved: boolean }) | null
  >(null);

  useEffect(() => {
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

    async function fetchWishes() {
      const { data } = (await supabase
        .from("Wish")
        .select()
        .filter("roomId", "eq", room.id)) as PostgrestResponse<Wish>;

      setWishes(data || []);
    }

    fetchMembers();
    fetchWishes();

    const subscription = supabase
      .from("*")
      .on("*", () => {
        fetchMembers();
        fetchWishes();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [room.id]);

  useEffect(() => {
    const gifteeId = wishes.find((wish) => wish.santaId === user.id)?.gifteeId;
    const giftee = members.find((member) => member.id === gifteeId);

    if (!giftee) return;

    setGiftee(giftee);
  }, [wishes, members, user.id]);

  async function becomeSanta(wishId: number) {
    await supabase
      .from("Wish")
      .update({ santaId: user.id, acceptedAt: new Date().toISOString() })
      .eq("id", wishId);
  }

  return (
    <>
      <Head>
        <title>{room.name} | Supa Secret Santa</title>
      </Head>

      {/* Room details */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-heading text-gray-800">
              {room.name}
            </h1>
            <Badge className="bg-green-100 text-green-800">{room.tag}</Badge>
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
      </Card>

      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {/* Create Wish */}
          {!wishes.find((wish) => wish.gifteeId === user.id) && (
            <CreateWish roomId={room.id} gifteeId={user.id} />
          )}

          {/* Wish List */}
          <ul className="mt-4 md:col-span-1 space-y-4">
            {wishes.map((wish) => (
              <li key={wish.id}>
                <Card>
                  <div className="md:flex md:justify-between md:items-center">
                    <a
                      href={wish.giftUrl}
                      className="flex-1 font-semibold underline"
                    >
                      {wish.giftName}
                    </a>
                    {!wish.santaId && wish.gifteeId !== user.id && (
                      <Button
                        type="button"
                        className="mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 md:mt-0 md:ml-3"
                        onClick={() => becomeSanta(wish.id)}
                      >
                        Gift 🎁
                      </Button>
                    )}
                    {wish.santaId === user.id && (
                      <Button
                        type="button"
                        className="mt-3 bg-green-600 hover:bg-green-700 focus:ring-green-500 md:mt-0 md:ml-3 md:w-auto md:text-sm"
                        onClick={() => setModalOpen(true)}
                      >
                        See address
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        {/* Members List */}
        <div className="md:col-span-1">
          <Card>
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
                      {member.id === room.creatorId && (
                        <Badge className="bg-green-100 text-green-800">
                          Admin
                        </Badge>
                      )}
                      {!member.isApproved && (
                        <Badge className="bg-red-100 text-red-800">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
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
