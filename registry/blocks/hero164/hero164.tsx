"use client";
import { Play } from "lucide-react";
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

interface Hero164Props {
  className?: string;
}

const Hero164 = ({ className }: Hero164Props) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <Fragment>
      <section className={cn("font-onest py-12 md:py-28", className)}>
        <div className="container">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <div className="flex h-full flex-col justify-between gap-12">
                <div className="flex max-w-[41.25rem] flex-col gap-9">
                  <h1 className="text-[2.5rem] leading-none text-primary sm:text-[3.4375rem] md:text-[4rem]">
                    Career Growth with Expert Mentorship
                  </h1>
                  <p className="text-lg font-medium text-primary md:text-xl">
                    Receive tailored mentorship aligned with your goals. Let
                    experienced mentors guide you to success with personalized
                    insights and dedicated support.
                  </p>
                  <Button
                    asChild
                    variant="default"
                    className="h-fit w-fit rounded-full px-8 py-4 font-semibold"
                  >
                    <a href="#">Sign up now</a>
                  </Button>
                </div>
                <div className="flex max-w-[24.375rem] flex-col gap-6">
                  <p className="text-xl text-primary">
                    Watch our introduction to discover our services
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => setIsVideoOpen(true)}
                    className="group relative flex aspect-video h-full w-full max-w-[24.375rem] overflow-hidden rounded-lg bg-accent bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg')] bg-[length:100%_100%] bg-center bg-no-repeat p-0 transition-all after:absolute after:block after:h-full after:w-full after:bg-background/5 after:content-[''] hover:bg-accent hover:bg-[length:120%_120%] hover:after:bg-black/15"
                  >
                    <AspectRatio ratio={16 / 9} className="flex h-full w-full">
                      <div className="m-auto aspect-square">
                        <Play className="h-10! w-10! fill-white stroke-white transition-transform group-hover:scale-125" />
                      </div>
                    </AspectRatio>
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                alt=""
                className="aspect-[4/5] h-full max-h-[62.5rem] w-full rounded-xl object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[50rem]">
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

export { Hero164 };
