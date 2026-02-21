import { ArrowUpRight } from "lucide-react";
import { BiLogoPlayStore } from "react-icons/bi";
import { FaApple } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Hero15Props {
  className?: string;
}

const Hero15 = ({ className }: Hero15Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">

      <div className="flex items-center justify-center">
        <Badge variant="outline" asChild >
          <a
            href="#"
            className="py-0 inline-flex items-center"
          >
            <span className="mr-1 font-semibold py-0.5">What&apos;s new</span>
            <span className="self-stretch w-px bg-border mx-1"></span>
            <span className="py-0.5">Read more</span>
            <ArrowUpRight className="ml-1 size-3" />
          </a>
        </Badge>  
        </div>
        <h1 className="mx-auto my-4 mb-6 max-w-3xl text-center text-3xl font-bold lg:text-5xl">
          Efficient tools that simplify your workflow.
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-muted-foreground lg:text-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum dolor
          assumenda voluptatem nemo magni a maiores aspernatur.
        </p>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full shadow-sm transition-shadow hover:shadow-md sm:w-auto lg:mt-10"
          >
            Get started for free
          </Button>
        </div>
        <div className="mt-8 lg:mt-12">
          <ul className="flex flex-wrap justify-center gap-6 text-sm lg:text-base">
            <li className="flex items-center gap-2 whitespace-nowrap">
              <BiLogoPlayStore className="size-5" />
              4.7 rating on Play Store
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap">
              <FaApple className="size-5" />
              4.8 rating on App Store
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap">
              <SiTrustpilot className="size-5" />
              4.9 rating on Trustpilot
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Hero15 };
