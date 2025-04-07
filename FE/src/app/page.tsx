import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddLocationForm from "./location/add/_components/AddLocationForm";
import ProfileForm from "./(auth)/login/_components/SignInForm";

const Page = async () => {
  const session = await auth()
  if(!session) redirect('/sign-in')
  return (
    <>
      <div>
      <ProfileForm/>
    </div>

    </>
  );
};

export default Page;
