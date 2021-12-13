import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";
import supabase from "../lib/supabase";
import Button from "./Button";

const Nav = () => {
  const user = supabase.auth.user();

  return (
    <nav className="bg-green-600 shadow-md shadow-green-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            {/* Logo */}
            <Link href="/dashboard">
              <a className="text-3xl text-white font-heading">
                Supa Secret Santa 🎅
              </a>
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-white">
            <Link href="/profile">
              <a className="">Profile</a>
            </Link>

            <Button
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              onClick={async () => await supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
