import { ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Hero136Props {
  className?: string;
}

const Hero136 = ({ className }: Hero136Props) => {
  return (
    <section className={cn("bg-background py-12 md:py-20", className)}>
      <div className="container max-w-[100rem]">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="mb-3 flex h-20 w-20 rounded-3xl bg-black shadow-[0_-16px_0_-8px_var(--color-gray-300),0_-30px_0_-14px_var(--color-gray-100)]">
            <Sparkles className="m-auto h-12 w-12 fill-white" />
          </div>
          <div className="max-w-[25rem] md:max-w-[31.25rem] lg:max-w-[43.75rem]">
            <h1 className="mb-6 text-center text-[2.75rem] leading-tight font-semibold text-foreground md:text-[3.5rem] lg:text-[4.375rem]">
              Unveil great design from the real world.
            </h1>
            <p className="text-center text-xl text-muted-foreground">
              Showcasing more than 500,000 screens and 2,000 iOS, Android, and
              Web apps — fresh content added every week.
            </p>
          </div>
          <div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <Button
                asChild
                className="h-fit rounded-full border border-primary px-4 py-3 text-base font-semibold"
              >
                <a href="#">Join for free</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex h-fit items-center justify-center gap-2 rounded-full px-4 py-3 text-base font-semibold"
              >
                <a href="#">
                  <div>See our plans</div>
                  <span className="flex h-6 w-6 rounded-full bg-zinc-100">
                    <ArrowRight className="m-auto h-4 w-4" />
                  </span>
                </a>
              </Button>
            </div>
          </div>
          <div>
            <div className="py-10 md:py-16">
              <p className="text-center text-sm text-foreground/60">
                Trusted by design teams at
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:flex-nowrap">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg"
                  alt=""
                  className="block h-3.5 w-auto opacity-50 md:h-5"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg"
                  alt=""
                  className="block h-3.5 w-auto opacity-50 md:h-5"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg"
                  alt=""
                  className="block h-3.5 w-auto opacity-50 md:h-5"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg"
                  alt=""
                  className="block h-3.5 w-auto opacity-50 md:h-5"
                />
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg"
                  alt=""
                  className="hidden h-3.5 w-auto opacity-50 md:block md:h-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full xl:px-8">
        <div className="relative mx-auto aspect-[1.259253731/1] w-full max-w-[96rem] overflow-hidden bg-zinc-950 xl:aspect-[1.896296296/1] xl:rounded-3xl">
          <div className="absolute -bottom-1 left-[56%] aspect-[1.151758794/-1] w-[100%] -translate-x-1/2 overflow-hidden rounded-tl-2xl bg-background xl:left-1/2 xl:aspect-[1.933988764/1] xl:w-[87.5%] xl:rounded-tr-2xl">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
              alt=""
              className="w-full object-cover object-top-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero136 };
