import { cn } from "@/lib/utils";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface Hero84Props {
  className?: string;
}

const Hero84 = ({ className }: Hero84Props) => {
  return (
    <section
      className={cn(
        "h-svg dark overflow-hidden bg-background pt-12 font-sans md:pt-20",
        className,
      )}
    >
      <div className="container">
        <div className="mb-24 flex flex-col items-center gap-8">
          <Badge className="w-fit rounded-full border border-white bg-transparent px-8 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-transparent">
            Uniqueness
          </Badge>
          <div>
            <h1 className="mb-5 text-center text-5xl font-bold text-foreground">
              Unify everything in one space
            </h1>
            <p className="max-w-[820px] text-center text-xl font-medium text-foreground">
              An all-in-one platform for seamless collaboration, our app merges
              client-facing portals with internal project management tools to
              streamline every phase of client projects.
            </p>
          </div>
        </div>
        <div className="relative mx-auto aspect-[2.488709677/1] max-w-[87.5rem]">
          <div className="absolute right-0 bottom-0 z-10 w-[27%] overflow-hidden">
            <AspectRatio ratio={0.924193548 / 1}>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                alt=""
                className="block size-full object-cover object-top-left"
              />
            </AspectRatio>
          </div>
          <div className="absolute right-[14%] bottom-0 z-20 w-[32%] overflow-hidden shadow-xl">
            <AspectRatio ratio={0.924193548 / 1}>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg"
                alt=""
                className="block size-full object-cover object-top-left"
              />
            </AspectRatio>
          </div>
          <div className="absolute bottom-0 left-1/2 z-30 w-[37%] -translate-x-1/2 overflow-hidden shadow-xl">
            <AspectRatio ratio={0.924193548 / 1}>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg"
                alt=""
                className="block size-full object-cover object-top-left"
              />
            </AspectRatio>
          </div>
          <div className="absolute bottom-0 left-[14%] z-20 w-[32%] overflow-hidden shadow-xl">
            <AspectRatio ratio={0.924193548 / 1}>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg"
                alt=""
                className="block size-full object-cover object-top-left"
              />
            </AspectRatio>
          </div>
          <div className="absolute bottom-0 left-0 z-10 w-[27%] overflow-hidden">
            <AspectRatio ratio={0.924193548 / 1}>
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg"
                alt=""
                className="block size-full object-cover object-top-left"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero84 };
