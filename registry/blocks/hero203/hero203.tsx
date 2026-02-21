import { ChevronUp } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const Hero203 = () => {
  return (
    <section className="bg-background py-32">
      <div className="relative container flex flex-col items-center px-0!">
        <div className="container flex w-full flex-col justify-between px-10 lg:flex-row">
          <div className="flex w-full flex-col gap-8">
            <a href="#" className="text-2xl font-semibold tracking-tighter">
              Shadcn Blocks
            </a>
            <h1 className="bg-re relative z-20 text-6xl font-semibold tracking-tighter md:text-8xl">
              The Blocks Built With Shadcn &amp; Tailwind.
            </h1>
            <p className="max-w-2xl tracking-tight text-muted-foreground md:text-xl">
              Finely crafted components built with React, Tailwind and Shadcn
              UI. Developers can copy and paste these blocks directly into their
              project.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-start md:mt-18 lg:w-5/9 lg:items-center">
            <Button className="rounded-2xl px-6 py-6 text-background shadow-[0px_1px_3px_#0000001a,inset_0px_2px_0px_#ffffff40] md:rounded-3xl md:px-12 md:py-8 md:text-lg">
              <p className="mr-1 text-xl text-background md:mr-3 md:text-2xl">
                
              </p>{" "}
              Sign up for free
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col justify-between pr-10 md:mt-10 md:flex-row">
          <DottedDiv className="group h-160 w-120 p-4">
            <div className="relative h-full w-full bg-muted/50 p-4 transition-all ease-in-out group-hover:bg-muted">
              {/* Bg Image div */}
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-5oYbG-sEImY-unsplash.jpg"
                  alt="aiImage"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="absolute top-4 -ml-4 flex h-full w-full flex-col items-center justify-between p-10">
                <p className="flex w-full items-center text-xl tracking-tighter text-background">
                  2025 <span className="mx-2 h-2.5 w-[1px] bg-background" />
                  March
                </p>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-center text-6xl font-semibold tracking-tight text-background">
                    Shadcn <br />
                    Carousal
                  </h2>
                  <div className="mt-2 h-1 w-6 rounded-full bg-background" />
                  <p className="mt-10 max-w-sm px-2 text-center text-lg leading-5 font-light tracking-tighter text-background/80">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iure debitis.
                  </p>
                </div>
                <a
                  href="#"
                  className="group mb-6 flex cursor-pointer flex-col items-center justify-center text-background"
                >
                  <ChevronUp
                    size={30}
                    className="transition-all ease-in-out group-hover:-translate-y-2"
                  />
                  <p className="text-xl tracking-tight text-background">
                    See All
                  </p>
                </a>
              </div>
            </div>
          </DottedDiv>
          <DottedDiv className="group h-160 w-120 p-4 lg:-mt-60">
            <div className="relative h-full w-full bg-muted/50 p-4 transition-all ease-in-out group-hover:bg-muted">
              {/* Bg Image div */}
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-majMgWtrF48-unsplash.jpg"
                  alt="aiImage"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
              </div>
              <div className="absolute top-4 -ml-4 flex h-full w-full flex-col items-center justify-between p-10">
                <p className="flex w-full items-center text-xl tracking-tighter text-background">
                  2025 <span className="mx-2 h-2.5 w-[1px] bg-background" />
                  March
                </p>
                <div className="flex flex-col items-center justify-center">
                  <h2 className="text-center text-6xl font-semibold tracking-tight text-background">
                    Shadcn <br />
                    Carousal
                  </h2>
                  <div className="mt-2 h-1 w-6 rounded-full bg-background" />
                  <p className="mt-10 max-w-sm px-2 text-center text-lg leading-5 font-light tracking-tighter text-background/80">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Iure debitis.
                  </p>
                </div>
                <a
                  href="#"
                  className="group mb-6 flex cursor-pointer flex-col items-center justify-center text-background"
                >
                  <ChevronUp
                    size={30}
                    className="transition-all ease-in-out group-hover:-translate-y-2"
                  />
                  <p className="text-xl tracking-tight text-background">
                    See All
                  </p>
                </a>
              </div>
            </div>
          </DottedDiv>
        </div>
      </div>
    </section>
  );
};

export { Hero203 };

const DottedDiv = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    <div className="absolute top-4 -left-25 h-[1.5px] w-[115%] bg-muted" />
    <div className="absolute bottom-4 -left-25 h-[1.5px] w-[115%] bg-muted" />
    <div className="absolute -top-25 left-4 h-[130%] w-[1.5px] bg-muted" />
    <div className="absolute -top-25 right-4 h-[130%] w-[1.5px] bg-muted" />
    <div className="absolute top-[12.5px] left-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute top-[12.5px] right-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute bottom-[12.5px] left-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    <div className="absolute right-[12.5px] bottom-[12.5px] z-10 size-2 rounded-full bg-foreground" />
    {children}
  </div>
);
