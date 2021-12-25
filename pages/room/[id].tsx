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
import MemberList from "../../components/MemberList";
import GifteeModal from "../../components/GifteeModal";
import WishList from "../../components/WishList";
import prisma from "../../lib/prisma";
import supabase from "../../lib/supabase";

interface RoomProps {
  user: User;
  roomData: string;
}

type Member = Profile & { isApproved: boolean };

const Room: NextPage<RoomProps> = ({ user, roomData }) => {
  const room: Room = JSON.parse(roomData);

  const [openOverlay, setOpenOverlay] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [giftee, setGiftee] = useState<
    (Member & { giftName: string; giftUrl: string }) | null
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
    const gift = wishes.find((wish) => wish.santaId === user.id);
    if (!gift) return;

    const { giftName, giftUrl, gifteeId } = gift;

    const giftee = members.find((member) => member.id === gifteeId);
    if (!giftee) return;

    setGiftee({ ...giftee, giftName, giftUrl });
  }, [wishes, members, user.id]);

  async function acceptInvitation(roomId: number, userId: string) {
    const { error } = await supabase
      .from("UsersInRooms")
      .update({ isApproved: true })
      .eq("roomId", roomId)
      .eq("userId", userId);

    if (error) toast.error(error.message);

    toast.success("Successfully accepted invitation");
  }

  const isAdmin = room.creatorId === user.id;
  const isApprovedMember = !!members.find(
    (member) => member.id === user.id && member.isApproved
  );
  const hasSharedWish = !!wishes.find((wish) => wish.gifteeId === user.id);

  return (
    <>
      <Head>
        <title>{room.name} | Supa Secret Santa</title>
      </Head>

      {/* Room details */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold">{room.name}</h1>
            <Badge className="mt-2">{room.tag}</Badge>
          </div>
          <div>
            {isAdmin && (
              <Button onClick={() => setOpenOverlay(!openOverlay)}>
                Invite
              </Button>
            )}
            {!isApprovedMember && (
              <Button onClick={() => acceptInvitation(room.id, user.id)}>
                Accept invite
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Create Wish */}
          {isApprovedMember && !hasSharedWish && (
            <CreateWish roomId={room.id} gifteeId={user.id} />
          )}

          {/* Wish List */}
          {isApprovedMember && !!wishes.length && (
            <Card>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-xl">Wishes 🌠</h3>
              </div>
              <div className="flow-root mt-6">
                <WishList
                  user={user}
                  wishes={wishes}
                  showModal={() => setOpenModal(true)}
                />
              </div>
            </Card>
          )}
        </div>

        {/* Member List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-xl">Members 👥</h3>
            </div>
            <div className="flow-root mt-6">
              <MemberList room={room} members={members} />
            </div>
          </Card>
        </div>
      </div>

      <InviteMemberOverlay
        roomId={room.id}
        open={openOverlay}
        setOpen={setOpenOverlay}
      />

      {giftee && (
        <GifteeModal open={openModal} setOpen={setOpenModal} giftee={giftee} />
      )}
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
