"use client";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";

interface Hero223Props {
  className?: string;
}

const Hero223 = ({ className }: Hero223Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="relative container flex h-150 w-full flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-background [mask-image:radial-gradient(transparent,white)]" />
        <Boxes className="scale-150" />

        <h1 className="relative z-99 max-w-4xl text-center text-5xl font-medium tracking-tight md:text-7xl">
          <span className="mr-3 text-muted-foreground/50">
            The only app you Need to Stay
          </span>
          <LineShadowText> Productive </LineShadowText>
          <span className="text-muted-foreground/50"> ever</span>
          <span>.</span>
        </h1>
        <p className="relative z-99 mt-4 max-w-xl text-center text-lg text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab sapiente
          quisquam debitis error vero possimus amet
        </p>
        <div className="realtive z-99 mt-10 flex items-center justify-center gap-4">
          <Button
            variant="default"
            className="text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>See Pricing</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
          <Button
            variant="secondary"
            className="text-md group flex w-fit items-center justify-center gap-2 rounded-full px-4 py-1 tracking-tight"
          >
            <span>Try it for free</span>
            <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Hero223 };

// Below is the modified component from Aceternity UI
// Original source: npx shadcn@latest add https://ui.aceternity.com/registry/background-boxes.json
// Modified to follow our coding standards and design system
// We respect copyright and attribution to the original creators

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  const colors = [
    "#33A1FD",
    "#2276FF",
    "#FDCA41",
    "#2EDCC3",
    "#FF99CA",
    "#E5D5C3",
    "#343433",
  ];
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-muted-foreground/20"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: `${getRandomColor()}`,
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-muted-foreground/20"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-muted"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
