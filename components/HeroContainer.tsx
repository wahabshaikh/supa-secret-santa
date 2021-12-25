import React from "react";
import Santa from "../assets/Santa.svg";
import Image from "next/image";
function HeroContainer() {
    return (
        <div className="max-w-7xl m-auto  flex sm-flex-column justify-between px-2 sm:px-6 lg:px-8 ">
            <div
                className="flex items-center"
                style={{
                    height: "600px",
                }}
            >
                <div>
                    <h1 className="font-extrabold  text-center lg:text-left text-transparent text-5xl bg-clip-text bg-gradient-to-r from-[#F96F65] via-[#F66F63] to-[#FD5395]">
                        Welcome to <br />
                        Supa Santa
                    </h1>
                    <div className="my-10">
                        <p className="text-white text-center lg:text-left ">
                            With the spirit of the holiday season, we bring to
                            you a Supabase powered
                        </p>
                        <p className="text-white text-center lg:text-left">
                            platform to be a Secret Santa for your loved ones,
                            online.
                        </p>
                    </div>
                    <div className="flex justify-center lg:justify-start">
                        <a
                            href="#_"
                            className="px-8 py-3  text-xl font-semibold text-center text-white transition duration-300 rounded-lg hover:to-pink-600 ease bg-gradient-to-br from-[#F96F65] to-[#FD5395] md:w-auto"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block mt-10 ">
                <div>
                    <Image src={Santa} width={500} height={500} alt="santa" />
                </div>
            </div>
        </div>
    );
}

export default HeroContainer;
