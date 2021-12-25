import { Room, User as Profile, Wish } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import supabase from "../lib/supabase";
import Button from "./Button";

interface WishListProps {
  user: User;
  wishes: Wish[];
  showModal: () => void;
}

const WishList = ({ user, wishes, showModal }: WishListProps) => {
  async function becomeSanta(wishId: number) {
    await supabase
      .from("Wish")
      .update({ santaId: user.id, acceptedAt: new Date().toISOString() })
      .eq("id", wishId);
  }

  return (
    <ul role="list" className="-my-5 divide-y divide-gray-200">
      {wishes.map((wish) => (
        <li key={wish.id} className="py-4">
          <div className="lg:flex lg:justify-between lg:items-center">
            <a href={wish.giftUrl} className="flex-1 font-semibold underline">
              {wish.giftName}
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
  );
};

export default WishList;
