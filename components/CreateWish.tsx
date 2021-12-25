import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import supabase from "../lib/supabase";
import Button from "./Button";
import Card from "./Card";
import Input from "./Input";

type Inputs = {
  giftName: string;
  giftUrl: string;
};

interface CreateWishProps {
  roomId: number;
  gifteeId: string;
}

const CreateWish = ({ roomId, gifteeId }: CreateWishProps) => {
  const methods = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let toastId: string | undefined;
    if (isLoading) {
      toastId = toast.loading("Sharing your wish...");
    }

    return () => toast.remove(toastId);
  }, [isLoading]);

  const submitHandler: SubmitHandler<Inputs> = (data) => createWish(data);

  async function createWish(data: Inputs) {
    setIsLoading(true);

    const { error } = await supabase.from("Wish").insert({
      roomId,
      ...data,
      gifteeId,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    setIsLoading(false);
    toast.success("Successfully shared your wish");
  }

  return (
    <Card>
      <h2 className="font-semibold text-xl">Make a wish ✨</h2>
      <FormProvider {...methods}>
        <form
          className="mt-4 space-y-4"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <div>
            <Input label="Gift name" name="giftName" />
          </div>

          <div>
            <Input label="Gift URL" name="giftUrl" />
          </div>

          <Button type="submit" variant="secondary" disabled={isLoading}>
            Share
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
};

export default CreateWish;
