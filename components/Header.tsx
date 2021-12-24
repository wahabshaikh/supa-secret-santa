import Image from "next/image";
import Link from "next/link";
import supabase from "../lib/supabase";
import Button from "./Button";

const Header = () => {
  return (
    <header className="bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard">
            <a className="flex-shrink-0 flex items-center">
              <Image
                height={72}
                width={72}
                src="/logo.png"
                alt="Supa Secret Santa"
              />
              <span className="hidden lg:block text-3xl text-white font-heading">
                Supa Secret Santa
              </span>
            </a>
          </Link>

          <nav className="flex items-center space-x-4 text-white">
            <Link href="/dashboard">
              <a>Dashboard</a>
            </Link>

            <Link href="/profile">
              <a>Profile</a>
            </Link>

            <Button onClick={async () => await supabase.auth.signOut()}>
              Sign Out
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
