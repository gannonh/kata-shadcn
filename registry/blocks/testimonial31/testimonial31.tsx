import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface DashedLineProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const DashedLine = ({
  orientation = "horizontal",
  className,
}: DashedLineProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "text-muted-foreground relative",
        isHorizontal ? "h-px w-full" : "h-full w-px",
        className
      )}
    >
      <div
        className={cn(
          isHorizontal
            ? [
                "h-px w-full",
                "bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]",
              ]
            : [
                "h-full w-px",
                "bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]",
                "[mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]",
              ]
        )}
      />
    </div>
  );
};

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

interface Testimonial31Props {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  testimonials?: Testimonial[];
  showDashedLine?: boolean;
  className?: string;
}

const Testimonial31 = ({
  heading = "Trusted by product builders",
  description = "Built on the habits that make the best product teams successful: staying focused, moving quickly, and always aiming for high-quality work.",
  ctaText = "Read our Customer Stories",
  ctaHref = "#",
  testimonials = [
    {
      quote: "We're misusing this as a CRM and it still works!",
      author: "Amy Chase",
      role: "PM",
      company: "Mercury Finance",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar-1.webp",
    },
    {
      quote: "I was able to replace 80% of my team with automation.",
      author: "Jonas Kotara",
      role: "Lead Engineer",
      company: "TechCorp",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar-2.webp",
    },
    {
      quote:
        "Founder Mode is hard enough without having a really nice PM app.",
      author: "Kevin Yam",
      role: "Founder",
      company: "StartupXYZ",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar-3.webp",
    },
    {
      quote: "I can use the tool as a substitute for my PM.",
      author: "Kundo Marta",
      role: "Founder",
      company: "InnovateCo",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar-4.webp",
    },
  ],
  showDashedLine = true,
  className,
}: Testimonial31Props) => {
  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <div className="space-y-4">
            <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
              {heading}
            </h2>
            <p className="text-muted-foreground max-w-md leading-snug">
              {description}
            </p>
            <Button variant="outline" className="shadow-md" asChild>
              <a href={ctaHref}>
                {ctaText} <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>

          <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="relative h-[288px] lg:h-[328px]">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            className="absolute inset-0 size-full object-cover object-top"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-10 p-6">
                          <blockquote className="text-lg leading-tight font-medium md:text-xl lg:text-2xl">
                            {testimonial.quote}
                          </blockquote>
                          <div className="space-y-0.5">
                            <div className="text-primary font-semibold">
                              {testimonial.author}, {testimonial.role}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      {showDashedLine && (
        <DashedLine
          orientation="horizontal"
          className="mx-auto max-w-[80%]"
        />
      )}
    </>
  );
};

export { Testimonial31 };
