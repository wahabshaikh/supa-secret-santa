import React from "react";
import Image from "next/image";
import Room from "../assets/Room.svg";
import Signup from "../assets/Signup.svg";
import Invite from "../assets/Invite.svg";
import Wish from "../assets/Wish.svg";
import Gift from "../assets/Gift.svg";
const data = [
    { title: "Sign up", image: Signup },
    { title: "Create a room", image: Room },
    { title: "Invite members", image: Invite },
    { title: "Share your wish", image: Wish },
    { title: "Receive gift", image: Gift },
    { title: "Sign out", image: Room },
];
const Participation = () => {
    return (
        <div className="max-w-7xl m-auto pb-20  px-2 sm:px-6 lg:px-8 ">
            <h1 className="font-extrabold text-center text-transparent text-2xl bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]">
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
                            <p className="text-gray-700 text-center text-base">
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Voluptatibus quia, nulla!
                                Maiores et perferendis eaque, exercitationem
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Participation;
