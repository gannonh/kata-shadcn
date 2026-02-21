import { cn } from "@/lib/utils";

interface Testimonial3Props {
  className?: string;
}

const Testimonial3 = ({ className }: Testimonial3Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="flex flex-col items-center gap-6 border-y py-14 text-center md:py-20">
          <q className="block max-w-4xl text-2xl font-medium lg:text-3xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
            nesciunt iste distinctio corporis, alias illum.
          </q>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark.svg"
              alt="shadcn"
              className="h-5 dark:invert"
            />
            <p className="font-medium">John Doe, Founder & CEO of Company</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial3 };
