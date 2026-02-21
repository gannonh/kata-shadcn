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

interface Hero134Props {
  className?: string;
}

const Hero134 = ({ className }: Hero134Props) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <Fragment>
      <section className={cn("bg-background py-12 md:py-20", className)}>
        <div className="overflow-hidden border-b border-muted">
          <div className="container">
            <div className="flex flex-col items-center gap-16 md:gap-24">
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-7">
                  <h1 className="max-w-[920px] text-center text-4xl leading-tight font-semibold text-foreground md:text-6xl lg:text-7xl">
                    Quickly convert visitors into paying customers
                  </h1>
                  <p className="max-w-[750px] text-center text-base leading-relaxed font-normal text-muted-foreground md:text-xl">
                    Transform your smartphone or tablet into a powerful tool.
                    Effortlessly manage sales and inventory, engage customers,
                    and boost your revenue.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8">
                  <Button className="group relative h-fit overflow-hidden rounded-full border-none px-6 py-5 font-semibold text-white max-lg:px-5 max-lg:py-3.5 lg:self-start">
                    <div className="relative z-10 flex items-center gap-2.5">
                      <span>Start Your Free Trial Today</span>
                    </div>
                    <div className="absolute bottom-16 -left-16 aspect-square w-16 rounded-full bg-pink-400 transition-all duration-300 group-hover:bottom-1/2 group-hover:-left-5 group-hover:w-[110%] group-hover:translate-y-1/2"></div>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setIsVideoOpen(true)}
                    className="flex h-fit w-fit items-center gap-2 text-lg font-semibold uppercase hover:bg-transparent"
                  >
                    <div className="flex h-10 w-10 rounded-full bg-primary">
                      <Play className="m-auto size-4 fill-white stroke-white" />
                    </div>
                    <div>Play Video</div>
                  </Button>
                </div>
              </div>
              <div className="w-full">
                <div className="relative h-fit w-full">
                  <div className="relative z-20 w-full max-w-[82.5rem] overflow-hidden rounded-t-xl md:rounded-t-3xl">
                    <AspectRatio ratio={2.095238095 / 1}>
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                        alt=""
                        className="size-full object-cover object-center"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-col items-center gap-16 py-20">
            <p className="text-center text-xl font-medium text-primary">
              Trusted by these brands and many others
            </p>
            <div className="flex flex-wrap items-center justify-center gap-20">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg"
                alt=""
                className="w-36 opacity-55"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg"
                alt=""
                className="w-36 opacity-55"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg"
                alt=""
                className="w-36 opacity-55"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg"
                alt=""
                className="w-36 opacity-55"
              />
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg"
                alt=""
                className="w-36 opacity-55"
              />
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

export { Hero134 };
