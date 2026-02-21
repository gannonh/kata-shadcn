import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { ThreeDMarquee } from "@/components/aceternity/3d-marquee";
import { Button } from "@/components/ui/button";

interface Hero239Props {
  className?: string;
}

const Hero239 = ({ className }: Hero239Props) => {
  const images = [
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img2.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img3.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img4.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img5.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img6.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img8.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img9.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img10.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img11.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img12.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img13.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img14.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img15.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img16.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img17.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img18.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img19.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img20.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img21.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img22.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img23.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img24.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img25.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img26.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img27.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img1.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img2.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img3.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img4.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img5.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img6.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img7.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img8.jpeg",
    "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/guri3/img9.jpeg",
  ];

  return (
    <section className={cn("relative py-32", className)}>
      <div className="container flex flex-col items-center justify-center gap-5 text-center">
        <p className="w-fit rounded-full bg-muted px-4 py-1 text-sm uppercase">
          shadcnblocks
        </p>
        <h1 className="mt-3 max-w-xl text-5xl font-medium font-semibold tracking-tighter lg:max-w-3xl lg:text-6xl">
          Unlock the Premium Blocks Just one time payment
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>
        <div className="flex items-center gap-4">
          <Button>Get Started</Button>
          <Button variant="ghost">
            Explore Benefits <ArrowRight />
          </Button>
        </div>

        <div className="mt-15 flex h-full w-full items-center justify-center">
          <ThreeDMarquee className="rounded-none" images={images} />
        </div>
      </div>
    </section>
  );
};

export { Hero239 };
