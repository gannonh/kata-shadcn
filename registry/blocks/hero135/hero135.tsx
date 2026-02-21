"use client";
import { MessagesSquare, Play } from "lucide-react";
import { Fragment, useState } from "react";

import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Hero135Props {
  className?: string;
}

const Hero135 = ({ className }: Hero135Props) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <Fragment>
      <section
        className={cn("bg-primary/5 py-12 font-sans md:py-20", className)}
      >
        <div className="container">
          <div className="flex flex-col justify-center gap-8 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-10">
              <div className="flex w-fit items-center gap-2 rounded-md bg-muted py-2 pr-3 pl-4">
                <MessagesSquare className="h-7 w-7 stroke-primary" />
                <div className="text-lg font-bold text-foreground">
                  Customer Stories
                </div>
              </div>
              <h1 className="max-w-96 text-7xl font-medium text-foreground lg:text-8xl">
                Client Journeys
              </h1>
              <p className="max-w-96 text-3xl leading-normal text-muted-foreground lg:text-4xl">
                Inspiring tales of bold companies thriving with Us.
              </p>
            </div>
            <div className="flex-1">
              <div className="relative w-full overflow-hidden rounded-3xl">
                <AspectRatio ratio={1}>
                  <div className="size-full">
                    <video
                      src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/man-1.mp4"
                      muted
                      autoPlay
                      loop
                      className="size-full object-cover object-center"
                    />
                    <Button
                      size="icon"
                      onClick={() => setIsVideoOpen(true)}
                      className="absolute bottom-0 left-0 m-10 flex size-fit w-fit items-center gap-4 rounded-full bg-background py-3 pr-8 pl-3 transition-transform hover:scale-105 hover:bg-background"
                    >
                      <div className="flex h-20 w-20 rounded-full bg-primary">
                        <Play className="m-auto size-7! fill-white stroke-white" />
                      </div>
                      <div>
                        <div className="text-left text-base font-semibold text-foreground">
                          John Doe
                        </div>
                        <div className="text-left text-base font-medium text-muted-foreground">
                          CEO
                        </div>
                      </div>
                    </Button>
                  </div>
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Presentation Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/your-video-id"
              title="Presentation Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export { Hero135 };
