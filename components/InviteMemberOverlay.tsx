import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Tag } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";

interface InviteMemberOverlayProps {
  roomId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const InviteMemberOverlay: FC<InviteMemberOverlayProps> = ({
  roomId,
  open,
  setOpen,
}) => {
  const [email, setEmail] = useState("");

  async function inviteMember() {
    await toast.promise(axios.post("/api/inviteMember", { email, roomId }), {
      loading: "Inviting to room...",
      success: (response) => response.data.message,
      error: (error) => error.toString(),
    });
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
                <form
                  className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                  onSubmit={(event) => {
                    event.preventDefault();
                    inviteMember();
                  }}
                >
                  <div className="flex-1 h-0 overflow-y-auto">
                    <div className="py-6 px-4 bg-indigo-700 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          New Room
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          Get started by filling in the information below to
                          create your new room.
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="px-4 divide-y divide-gray-200 sm:px-6">
                        <div className="space-y-6 pt-6 pb-5">
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-900"
                            >
                              User&apos;s email
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="email"
                                id="email"
                                className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                value={email}
                                onChange={(event) =>
                                  setEmail(event.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InviteMemberOverlay;
