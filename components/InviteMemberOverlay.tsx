import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { PostgrestResponse } from "@supabase/supabase-js";
import Button from "./Button";
import Input from "./Input";
import supabase from "../lib/supabase";

type Inputs = {
  email: string;
};

interface InviteMemberOverlayProps {
  roomId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const InviteMemberOverlay = ({
  roomId,
  open,
  setOpen,
}: InviteMemberOverlayProps) => {
  const methods = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler: SubmitHandler<Inputs> = (data) => inviteMember(data);

  async function inviteMember({ email }: Inputs) {
    setIsLoading(true);

    const { data, error: getUserError } = (await supabase
      .from("User")
      .select("id")
      .eq("email", email)) as PostgrestResponse<{ id: string }>;

    const user = data?.[0];
    if (!user) {
      setIsLoading(false);
      toast.error(`User not found. Please ask ${email} to sign up.`);
      return;
    } else if (getUserError) {
      setIsLoading(false);
      toast.error(getUserError.message);
      return;
    }

    const userId = user.id;
    const { error: insertUserInRoomError } = await supabase
      .from("UsersInRooms")
      .insert({
        roomId,
        userId,
        joinedAt: new Date().toISOString(),
      });

    if (insertUserInRoomError) {
      setIsLoading(false);
      toast.error(insertUserInRoomError.message);
      return;
    }

    setIsLoading(false);
    toast.success(`Successfully invited ${email} to the room`);
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <FormProvider {...methods}>
                  <form
                    className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                    onSubmit={methods.handleSubmit(submitHandler)}
                  >
                    <div className="flex-1 h-0 overflow-y-auto">
                      <div className="py-6 px-4 bg-green-700 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            Invite to Room
                          </Dialog.Title>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="bg-green-700 rounded-md text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-green-300">
                            Get started by filling in the information below to
                            invite a member to your room. Make sure they are
                            signed up to receive an invitation.
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="px-4 divide-y divide-gray-200 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            <div>
                              <Input label="User's email" name="email" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                      <Button variant="tertiary" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="ml-4"
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InviteMemberOverlay;
