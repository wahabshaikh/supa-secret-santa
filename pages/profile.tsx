import { User } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Input from "../components/Input";
import Select from "../components/Select";
import prisma from "../lib/prisma";
import supabase from "../lib/supabase";
import countries from "../data/countries.json";
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useState } from "react";

type Inputs = {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  country: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
};

interface IProfile {
  profile: string;
}

const Profile: NextPage<IProfile> = ({ profile }) => {
  const { id, email, ...defaultValues } = JSON.parse(profile) as User;
  const methods = useForm<Inputs>({ defaultValues });
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler: SubmitHandler<Inputs> = (data) => createProfile(data);

  async function createProfile(data: Inputs) {
    setIsLoading(true);

    const { error } = await supabase
      .from("User")
      .upsert({ id, email, ...data });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    setIsLoading(false);
    toast.success(`Successfully updated profile`);
  }

  const firstName = methods.watch("firstName");
  const avatarUrl = methods.watch("avatarUrl");

  return (
    <>
      <Head>
        <title>Profile | Supa Secret Santa</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-5 md:p-6 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form
            className="space-y-8 divide-y divide-gray-200"
            onSubmit={methods.handleSubmit(submitHandler)}
          >
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    Profile
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6 flex items-center">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={firstName} />
                      ) : (
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                    <div className="ml-4 flex-1">
                      <Input label="Avatar URL" name="avatarUrl" />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      label="First name"
                      name="firstName"
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      label="Last name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      defaultValue={email}
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
                    <Select
                      label="Country"
                      name="country"
                      autoComplete="country-name"
                      options={countries}
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <Input
                      label="Street address"
                      name="street"
                      autoComplete="street-address"
                    />
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
                    <Input
                      label="Zip / Postal code"
                      name="postalCode"
                      autoComplete="postal-code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Check for authenticated user
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  // Get profile information
  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return {
    props: {
      profile: JSON.stringify({ ...profile, id: user.id, email: user.email }),
    },
  };
};
export default Profile;
