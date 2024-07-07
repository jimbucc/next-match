import TopNav from "@/components/navbar/TopNav";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaRegSmile } from "react-icons/fa";

const Home = () => {
  return (
    <div>

      <h1 className="text-3xl text-red-950 font-semibold">Hello App!</h1>
      <Button 
        as={Link}
        href='/members'
        color="primary" 
        variant="bordered"
        startContent={<FaRegSmile size={20}/>}>
          Click Me
        </Button>
    </div>
  );
}

export default Home;
