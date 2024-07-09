import { auth, signOut } from "@/auth";
import TopNav from "@/components/navbar/TopNav";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaRegSmile } from "react-icons/fa";

const Home = async () => {
  const session = await auth()
  return (
    <div>
      <h1 className="text-3xl text-red-950 font-semibold">Hello App!</h1>
      <h3 className="text-2xl font-semibold">User Session data:</h3>
      {session ? (
        <div>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <Button
              type="submit"
              color="primary"
              variant="bordered"
              startContent={<FaRegSmile size={20} />}
            >
              Sign Out
            </Button>
          </form>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </div>
  )
}

export default Home;
