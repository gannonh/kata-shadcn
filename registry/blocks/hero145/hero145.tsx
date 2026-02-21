import { ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Hero145Props {
  className?: string;
}

const Hero145 = ({ className }: Hero145Props) => {
  return (
    <section
      className={cn(
        "dark relative h-svh max-h-[1400px] w-full bg-[url(https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/andrew-kliatskyi-uBg4k82xnI4-unsplash.jpg)] bg-cover bg-[100%] bg-no-repeat before:absolute before:top-0 before:left-0 before:size-full before:bg-[radial-gradient(circle_at_100%_-100%,transparent_40%,rgba(0,0,0,.75)_85%)] before:content-['']",
        className,
      )}
    >
      <div className="relative z-10 container flex size-full max-w-[103.125rem] flex-col justify-between pt-24 pb-14 md:justify-end">
        <div className="flex h-full flex-col justify-between gap-6 md:justify-end">
          <h1 className="text-4xl leading-[2.25rem] font-bold text-foreground lg:text-5xl lg:leading-[3rem]! xl:text-7xl xl:leading-[5.5rem]!">
            <div className="mb-2">We help you to hire top</div>
            <div className="relative h-[calc(2.25rem*3)] md:h-[2.25rem] lg:h-[3rem] xl:h-[5.5rem]">
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_0s] will-change-[opacity]">
                Cybersecurity sales reps
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_2s] opacity-0 will-change-[opacity]">
                Pen testers
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_4s] opacity-0 will-change-[opacity]">
                Sales engineers
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_6s] opacity-0 will-change-[opacity]">
                IAM architects
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_8s] opacity-0 will-change-[opacity]">
                Chief Information Security Officers
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_10s] opacity-0 will-change-[opacity]">
                Cloud security engineers
              </div>
              <div className="absolute top-0 left-0 animate-[show-text_14s_ease-in-out_infinite_12s] opacity-0 will-change-[opacity]">
                Application Security Engineers
              </div>
            </div>
          </h1>
          <div className="flex flex-col gap-8">
            <p className="text-lg text-foreground lg:text-2xl">
              Discover exceptional talent, fast.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="flex flex-wrap items-center gap-5">
                <Button
                  asChild
                  className="h-fit w-fit rounded-full px-7 py-3.5 text-xs font-semibold text-nowrap uppercase lg:px-9 lg:py-5 lg:text-base"
                >
                  <a href="#">Join our network</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-fit w-fit rounded-full border-white bg-transparent px-7 py-3.5 text-xs font-semibold text-nowrap text-white uppercase hover:bg-background/15 lg:px-9 lg:py-5 lg:text-base"
                >
                  <a href="#">Hire top talent</a>
                </Button>
              </div>
              <Button
                variant="link"
                className="flex h-fit w-fit items-center gap-2 text-xs font-semibold text-nowrap uppercase hover:no-underline lg:text-base"
              >
                <div>Scroll to explore</div>
                <ArrowDown className="size-3! stroke-white lg:size-4!" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero145 };
