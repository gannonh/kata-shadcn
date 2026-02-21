"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Globe } from "@/components/magicui/globe";
import { Meteors } from "@/components/magicui/meteors";
import { Button } from "@/components/ui/button";

interface Hero216Props {
  className?: string;
}

const Hero216 = ({ className }: Hero216Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container flex flex-col items-center justify-center gap-4 overflow-hidden">
        <p className="text-muted-foreground">
          Bridging Developers, Building the Future
        </p>
        <h1 className="max-w-3xl text-center font-calSans text-6xl md:text-7xl">
          Connecting Developers Worldwide
        </h1>

        <Meteors number={30} />

        <Button
          variant="secondary"
          className="text-md group mt-10 flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
        >
          Get Started
          <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
        </Button>
        <div className="relative h-115 w-full overflow-y-clip">
          <Globe className="translate-y-40 scale-175" />
        </div>
      </div>
    </section>
  );
};

export { Hero216 };
