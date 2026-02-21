import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { BackgroundBeamsWithCollision } from "@/components/aceternity/background-beams-with-collision";
import { Button } from "@/components/ui/button";

interface Hero241Props {
  className?: string;
}

const Hero241 = ({ className }: Hero241Props) => {
  return (
    <section
      className={cn(
        "relative h-full min-h-screen w-screen overflow-hidden py-32",
        className,
      )}
    >
      <div className="static z-10 container flex flex-col items-center justify-center gap-10 text-center">
        <h1 className="mt-10 font-playfair text-5xl font-medium tracking-tight lg:text-7xl">
          Your Shortcut to <br /> Launch-Ready Interfaces
        </h1>
        <p className="max-w-xl leading-5 font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>
        <div className="flex items-center gap-4">
          <Button className="text-md rounded-xl font-serif">
            Documentation <ArrowRight className="-rotate-45" />{" "}
          </Button>
          <Button variant="secondary" className="text-md rounded-xl font-serif">
            Try it for free <ArrowRight className="-rotate-45" />{" "}
          </Button>
        </div>
        <div className="absolute bottom-8 flex items-center justify-center gap-7">
          <div className="text-right">
            <h1 className="font-serif text-4xl tracking-tight">&lt;$1.2M</h1>
            <p className="text-muted-foreground">Developer Trust</p>
          </div>
          <div className="h-24 w-px bg-foreground" />
          <div className="text-left">
            <h1 className="font-serif text-4xl tracking-tight">95.1%</h1>
            <p className="text-muted-foreground">Less Dev Time</p>
          </div>
        </div>
      </div>
      <BackgroundBeamsWithCollision className="absolute bottom-0 bg-gradient-to-b from-[#d9d9d9]/0 to-[#89e5ff] z-1">
        <span></span>
      </BackgroundBeamsWithCollision>
    </section>
  );
};

export { Hero241 };
