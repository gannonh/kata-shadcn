"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Calendar,
  Route,
  Text,
  Waypoints,
  Workflow,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Hero196Props {
  className?: string;
}

const TAB_LIST = [
  {
    icon: Calendar,
    title: "Scheduling",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
  },
  {
    icon: Route,
    title: "Routing",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
  },
  {
    icon: Workflow,
    title: "Workflows",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-3.svg",
  },
  {
    icon: Text,
    title: "Forms",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
  },
  {
    icon: Waypoints,
    title: "Enrichment",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
  },
];

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .required({ email: true });

const HeroForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="sr-only">
              Email
            </FieldLabel>
            <div className="w-full">
              <div className="relative flex w-full flex-col gap-2 lg:block">
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="What's your work email?"
                  className="h-fit bg-background py-4 pr-5 pl-5 lg:pr-[13.75rem]"
                />
                <div className="top-1/2 right-2.5 lg:absolute lg:-translate-y-1/2">
                  <Button
                    type="submit"
                    className="w-full rounded-full lg:w-fit"
                  >
                    See Default in action
                    <ArrowRight />
                  </Button>
                </div>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} className="py-1" />
              )}
            </div>
          </Field>
        )}
      />
    </form>
  );
};

const Hero196 = ({ className }: Hero196Props) => {
  return (
    <section
      className={cn(
        "bg-muted bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/dot-pattern-2.svg')] bg-[length:3.125rem_3.125rem] bg-repeat py-20",
        className,
      )}
    >
      <div className="container">
        <div className="flex w-full flex-col gap-14">
          <div className="flex w-full max-w-[80rem] flex-col items-center gap-6">
            <Badge
              asChild
              variant="outline"
              className="gap-2.5 rounded-full bg-background px-3! py-1.5 text-sm leading-[1.2] font-medium"
            >
              <a href="#">
                Introducing version 2.0!
                <ArrowRight className="size-base" />
              </a>
            </Badge>
            <h1 className="text-center text-[2.5rem] leading-[.97] font-bold sm:text-[3.5rem] md:text-[4rem]">
              Transform inbound with smarter routing, actionable insights, and
              fast scheduling
            </h1>
            <div className="flex w-full max-w-[36rem] flex-col items-center justify-center gap-6 pt-5">
              <p className="text-center text-[1.25rem] leading-snug font-medium text-foreground">
                Drive scalable growth with a single platform that automates
                scheduling, routing, enrichment, and intent workflows.
              </p>
              <div className="w-full max-w-[30rem]">
                <HeroForm />
              </div>
            </div>
          </div>
          <div>
            <Tabs
              defaultValue={TAB_LIST[0].title}
              className="w-full max-w-[85rem] gap-5 rounded-3xl bg-background p-2.5"
            >
              <TabsList className="flex h-fit w-full max-w-fit items-start justify-start gap-2.5 overflow-auto rounded-2xl bg-muted p-2.5 md:mx-auto md:items-center md:justify-center">
                {TAB_LIST.map((trigger, i) => (
                  <TabsTrigger
                    className="fshrink-0 bg-background px-5 py-2.5"
                    key={`tab-trigger-${i}`}
                    value={trigger.title}
                  >
                    <trigger.icon />
                    {trigger.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TAB_LIST.map((content, i) => (
                <TabsContent key={`tab-content-${i}`} value={content.title}>
                  <div className="aspect-[1.696202532] w-full overflow-hidden rounded-3xl">
                    <img
                      src={content.image}
                      alt=""
                      className="block size-full object-cover object-center"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero196 };
