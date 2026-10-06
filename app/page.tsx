import Image from "next/image";
import {Navigation} from "@/components/sections/navigation.tsx";
import {Hero} from "@/components/sections/hero.tsx";
import {Footer} from "@/components/sections/footer.tsx";

export default function Home() {
  return (
    <>
        <Navigation/>
        <Hero />
        <Footer/>
    </>
  );
}
