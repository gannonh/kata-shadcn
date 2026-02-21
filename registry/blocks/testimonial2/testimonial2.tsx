import { cn } from "@/lib/utils";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Testimonial2Props {
  className?: string;
}

const Testimonial2 = ({ className }: Testimonial2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="text-center">
          <div className="text-3xl font-bold md:text-5xl lg:text-7xl">
            <p className="flex flex-wrap items-center justify-center">
              Begin hiring
              <span className="mx-4 inline-flex items-center -space-x-4">
                <Avatar className="size-11 border lg:size-16">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-11 border lg:size-16">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp"
                    alt="placeholder"
                  />
                </Avatar>
                <Avatar className="size-11 border lg:size-16">
                  <AvatarImage
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp"
                    alt="placeholder"
                  />
                </Avatar>
              </span>
              quickly. At no cost at all.
            </p>
          </div>
          <Button size="lg" className="mt-10">
            Get started for free
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Testimonial2 };
