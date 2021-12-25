import { User as Profile } from "@prisma/client";
import { Dispatch, FC, Fragment, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { GiftIcon } from "@heroicons/react/solid";
import ReactConfetti from "react-confetti";

interface GifteeModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  giftee: Profile & { isApproved: boolean; giftName: string; giftUrl: string };
}

const GifteeModal: FC<GifteeModalProps> = ({ open, setOpen, giftee }) => {
  const {
    avatarUrl,
    firstName,
    lastName,
    email,
    street,
    city,
    region,
    country,
    postalCode,
    giftName,
    giftUrl,
  } = giftee;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <ReactConfetti
            numberOfPieces={1000}
            recycle={false}
            tweenDuration={10000}
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <GiftIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-center text-gray-900">
                    <span className="text-gray-600">
                      Hooray! You are a Secret Santa for
                    </span>
                    <br />
                    <img
                      className="mt-4 inline-block h-14 w-14 rounded-md"
                      src={avatarUrl}
                      alt={firstName}
                    />
                    <span className="block text-xl font-semibold">
                      {`${firstName} ${lastName}`}
                    </span>
                    ({email})
                  </Dialog.Title>
                  <Dialog.Description
                    as="p"
                    className="mt-4 text-sm text-gray-600"
                  >
                    {`${street}, ${city}, ${region}, ${country}, ${postalCode}`}
                  </Dialog.Description>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <a
                  href={giftUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                >
                  Checkout {giftName}
                </a>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default GifteeModal;
