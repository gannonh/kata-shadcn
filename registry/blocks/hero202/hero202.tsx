import { ArrowRightIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Hero202Props {
  className?: string;
}

const Hero202 = ({ className }: Hero202Props) => {
  return (
    <section className={cn("bg-background py-32", className)}>
      <div className="container">
        <Card className="group relative w-full overflow-hidden rounded-4xl border border-none bg-muted shadow-none">
          <CardContent className="py-12 lg:px-18 lg:py-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <p className="flex items-center gap-2 text-xl font-medium tracking-tight text-foreground">
                  <img
                    className="size-6"
                    alt="Copy paste icon"
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg"
                  />
                  Copy Paste Blocks
                </p>

                <h1 className="mt-3 text-8xl font-bold tracking-tighter text-foreground">
                  Let's Create Something
                  <span className="bg-linear-to-b from-background to-foreground bg-clip-text text-transparent">
                    {" "}
                    Amazing!
                  </span>
                </h1>

                <div className="mt-4 flex gap-2">
                  <Button className="h-13 w-fit rounded-full px-8 text-lg">
                    Let's Talk
                  </Button>
                  <Button
                    variant="outline"
                    className="size-13 -rotate-45 rounded-full transition-all ease-in-out hover:rotate-0"
                  >
                    <ArrowRightIcon />
                  </Button>
                </div>
              </div>
              <div className="absolute -right-70 -bottom-70 -rotate-45 transition-all ease-in-out group-hover:-rotate-0">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/illustrations/tokyo-solar-system-around-a-smiley.svg"
                  className="size-150 md:size-220"
                  alt=""
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { Hero202 };
