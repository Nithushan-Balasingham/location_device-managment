'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="flex bg-black items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-green-400">404</h1>
        <h2 className="text-green-400 text-3xl mb-4">No Page Found</h2>

        <Button onClick={handleBack} variant={"secondary"}>
          Return to website
        </Button>
      </div>
    </div>
  );
}
