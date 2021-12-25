import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Wish } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import ReactConfetti from "react-confetti";
import toast from "react-hot-toast";
import supabase from "../lib/supabase";
import Button from "./Button";

interface WishListProps {
  user: User;
  wishes: Wish[];
  showModal: () => void;
}

const WishList = ({ user, wishes, showModal }: WishListProps) => {
  const [acceptedWish, setAcceptedWish] = useState(false);

  async function becomeSanta(wishId: number) {
    const { error } = await supabase
      .from("Wish")
      .update({ santaId: user.id, acceptedAt: new Date().toISOString() })
      .eq("id", wishId);

    if (error) return toast.error(error.message);

    setAcceptedWish(true);
    toast.success(`You have become a Secret Santa`);
  }

  return (
    <>
      {acceptedWish && (
        <ReactConfetti
          numberOfPieces={500}
          tweenDuration={10000}
          recycle={false}
          onConfettiComplete={() => setAcceptedWish(false)}
        />
      )}
      <ul role="list" className="-my-5 divide-y divide-gray-200">
        {wishes.map((wish) => (
          <li key={wish.id} className="py-4">
            <div className="lg:flex lg:justify-between lg:items-center">
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={wish.giftUrl}
                className="flex-1 inline-flex items-center"
              >
                {wish.giftName}
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
              </a>
              {!wish.santaId && wish.gifteeId !== user.id && (
                <Button
                  variant="secondary"
                  className="mt-3 lg:mt-0 lg:ml-3"
                  onClick={() => becomeSanta(wish.id)}
                >
                  Gift 🎁
                </Button>
              )}
              {wish.santaId === user.id && (
                <Button
                  variant="secondary"
                  className="mt-3 lg:mt-0 lg:ml-3"
                  onClick={showModal}
                >
                  Reveal Giftee
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default WishList;
