import { useState } from "react";
import toast from "react-hot-toast";
import supabase from "../lib/supabase";
import Button from "./Button";
import Card from "./Card";

interface CreateWishProps {
  roomId: number;
  gifteeId: string;
}

const CreateWish = ({ roomId, gifteeId }: CreateWishProps) => {
  const [giftName, setGiftName] = useState("");
  const [giftUrl, setGiftUrl] = useState("");

  async function createWish() {
    const { error } = await supabase.from("Wish").insert({
      roomId,
      giftName,
      giftUrl,
      gifteeId,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setGiftName("");
    setGiftUrl("");
    toast.success("Successfully shared your wish");
  }

  return (
    <Card>
      <h2>Make a wish</h2>
      <form
        className="mt-4 space-y-4"
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
    </Card>
  );
};

export default CreateWish;
