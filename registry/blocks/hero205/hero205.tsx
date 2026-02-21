"use client";

import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Hero205Props {
  className?: string;
}

const Hero205 = ({ className }: Hero205Props) => {
  return (
    <section className={cn("bg-background", className)}>
      <div className="container py-32">
        <div>
          {/* Header  */}
          <h1 className="text-5xl leading-tight tracking-tighter md:text-7xl">
            <span className="font-semibold">Architecting </span>
            <span className="font-playfair italic">
              userFriendly <br />
            </span>
            <span className="font-semibold">apps (professionally) </span>
          </h1>

          {/* Professional info */}
          <div className="mt-8 flex flex-wrap items-center gap-3 tracking-tight md:text-xl">
            <span>Frontend Developer</span>
            <div className="flex size-8 rotate-14 items-center justify-center rounded-lg bg-foreground shadow-xl">
              <Flash />
            </div>
            <span>ShadCN Blocks</span>
            <div className="size-2 rounded-full bg-foreground" />
            <span className="text-muted-foreground">
              Previously, Procuduct Designer Freelancer, Punjab
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-start gap-3 md:flex-row">
            <Button className="flex h-auto gap-3 rounded-full font-medium md:py-3 md:text-lg">
              <span className="pl-2">Get in touch</span>
              <ChevronRightIcon className="h-3 w-3" />
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="h-auto rounded-full font-medium md:px-5 md:py-3 md:text-lg"
              >
                View all Blocks
              </Button>
              <Line />
              <p className="-ml-3 tracking-tight">Tap it's free</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 100, y: 0 }}
          transition={{ ease: [0, 0.71, 0.2, 1.01], duration: 0.8 }}
        >
          <Card className="group mx-auto mt-24 h-100 w-full rounded-4xl border border-border bg-muted/30 p-2 shadow-none md:h-190 md:p-3">
            <CardContent className="size-full rounded-3xl border-2 border-background bg-muted">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                className="size-full"
                alt=""
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export { Hero205 };

const Flash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="13"
    height="15"
    viewBox="0 0 13 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.55191 6.02443L11.7837 7.65512C12.3525 7.87431 12.4411 8.64213 11.9371 8.98504L4.63357 13.9543C3.81688 14.51 2.7714 13.6807 3.12658 12.759L4.73014 8.59757L0.498337 6.96688C-0.0704765 6.74769 -0.159028 5.97986 0.34496 5.63695L7.64848 0.667678C8.46517 0.112006 9.51065 0.941277 9.15547 1.86301L7.55191 6.02443Z"
      fill="white"
    />
  </svg>
);

const Line = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="83"
    height="36"
    viewBox="0 0 83 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.54 19.8917L41.3058 20.5348L40.54 19.8917ZM1.63581 24.9844C1.0855 25.0311 0.677219 25.515 0.723883 26.0653L1.48433 35.0331C1.53099 35.5834 2.01493 35.9917 2.56524 35.9451C3.11555 35.8984 3.52384 35.4144 3.47717 34.8641L2.80123 26.8927L10.7726 26.2168C11.3229 26.1701 11.7312 25.6862 11.6845 25.1359C11.6379 24.5856 11.1539 24.1773 10.6036 24.2239L1.63581 24.9844ZM82.2736 5.64287C76.5724 3.44962 72.1116 1.90993 68.3792 1.17068C64.6243 0.426972 61.5404 0.479043 58.619 1.52454C55.7174 2.56298 53.0827 4.54437 50.1573 7.45564C47.236 10.3628 43.9495 14.2763 39.7742 19.2487L41.3058 20.5348C45.5032 15.5361 48.7246 11.703 51.5681 8.87328C54.4074 6.04765 56.7943 4.30177 59.2929 3.40759C61.7717 2.52047 64.4665 2.43457 67.9906 3.13257C71.5372 3.83502 75.8555 5.3167 81.5555 7.50951L82.2736 5.64287ZM39.7742 19.2487C31.6752 28.8938 24.4557 32.0798 18.3123 32.0962C12.1277 32.1127 6.75778 28.9224 2.36514 25.2165L1.07548 26.7451C5.60504 30.5666 11.4303 34.1146 18.3177 34.0962C25.2462 34.0777 32.9755 30.4554 41.3058 20.5348L39.7742 19.2487Z"
      fill="black"
    />
  </svg>
);
