import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import DotPattern from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="w-full mt-44 flex justify-center items-center">
        <h1 className="w-2/3 my-12 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/95 bg-clip-text text-center text-8xl font-semibold leading-tight text-transparent dark:from-white dark:to-slate-900/10">
          Oxtro: Solusi Bisnis Terintegrasi, Sederhana dan Andal.
        </h1>
      </div>
      <div className="z-10 flex items-center justify-center">
        <Link href={'/login'}
          className={cn(
            "group rounded-full border py-1.5 px-3 border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Login untuk mengakses produk kami</span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </Link>
      </div>
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
        )}
      />
    </main>
  );
}

