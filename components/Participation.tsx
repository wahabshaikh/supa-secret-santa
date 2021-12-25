import React from "react";
import Image from "next/image";
import Room from "../assets/Room.svg";
import Signup from "../assets/Signup.svg";
import Invite from "../assets/Invite.svg";
import Wish from "../assets/Wish.svg";
import Gift from "../assets/Gift.svg";
const data = [
    {
        title: "Sign up",
        image: Signup,
        description:
            "Sign up your email and fill the profile information. It is required to use the application",
    },
    {
        title: "Create a room",
        image: Room,
        description:
            "Create a room for your family, friends or coworkers. It creates a safe environment and ensures unknown people cannot see your shipping address. ",
    },
    {
        title: "Invite members",
        image: Invite,
        description:
            "Invite members to the room using their email address. Make sure they are already signed up and filled their profile in order to receive an invitation.",
    },
    {
        title: "Share your wish",
        image: Wish,
        description:
            " Share your wish with your loved ones. Include the gift's name and url and wait till someone becomes your Secret Santa.",
    },
    {
        title: "Send and Receive gift",
        image: Gift,
        description:
            "There's as much joy in giving as receiving. So, see through the list of wishes and become someone's Secret Santa, while you wait for your gift.",
    },
    {
        title: "Enjoy your gift",
        image: Room,
        description: " Enjoy after receiving your gifts ",
    },
];
const Participation = () => {
    return (
        <div className="max-w-7xl m-auto pb-20  px-2 sm:px-6 lg:px-8 ">
            <h1 className="font-extrabold font-heading text-center text-transparent text-2xl bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]">
                Share gifts to your loved ones
            </h1>
            <div className="text-white  my-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((i, index) => (
                    <div
                        key={index}
                        className="w-80 mx-auto bg-lightbrown mt-3 rounded-lg  overflow-hidden shadow-lg"
                    >
                        <div className=" w-32 h-32 mx-auto mt-4">
                            <Image
                                src={i.image}
                                width={150}
                                height={150}
                                alt="room"
                            />
                        </div>
                        <div className="px-6 py-4">
                            <div className="font-bold text-center mb-2">
                                {i.title}
                            </div>
                            <p className="text-center text-transparent text-2xl bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395] text-center text-base">
                                {i.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Participation;
