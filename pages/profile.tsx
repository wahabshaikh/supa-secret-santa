import { User } from "@supabase/supabase-js";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Input from "../components/Input";
import Select from "../components/Select";
import supabase from "../lib/supabase";
import countries from "../data/countries.json";

interface IProfile {
  user: User;
}

const Profile: NextPage<IProfile> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Profile | Supa Secret Santa</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <form className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6 flex items-center">
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <div className="ml-4 flex-1">
                    <Input label="Avatar URL" name="avatar-url" />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="First name"
                    name="first-name"
                    autoComplete="given-name"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Last name"
                    name="last-name"
                    autoComplete="family-name"
                  />
                </div>

                <div className="sm:col-span-6">
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    defaultValue={user.email}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Shipping Address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Use a permanent address where you can receive the gift.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Select label="Country" name="country" options={countries} />
                </div>

                <div className="sm:col-span-6">
                  <Input label="Street address" name="street-address" />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="City"
                    name="city"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="State / Province"
                    name="region"
                    autoComplete="address-level1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input label="Zip / Postal code" name="postal-code" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: { destination: "/login", permanent: "false" },
    };
  }

  return { props: { user } };
};

export default Profile;
