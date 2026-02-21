"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const bgPattern = {
  backgroundImage:
    "linear-gradient(135deg, var(--muted) 25%, transparent 25.5%, transparent 50%, var(--muted) 50.5%, var(--muted) 75%, transparent 75.5%, transparent)",
  backgroundSize: "10px 10px",
};

interface Hero246Props {
  className?: string;
}

const Hero246 = ({ className }: Hero246Props) => {
  const chartData = [
    { date: "2024-04-01", views: 372 },
    { date: "2024-04-02", views: 277 },
    { date: "2024-04-03", views: 287 },
    { date: "2024-04-04", views: 502 },
    { date: "2024-04-05", views: 663 },
    { date: "2024-04-06", views: 641 },
    { date: "2024-04-07", views: 425 },
    { date: "2024-04-08", views: 729 },
    { date: "2024-04-09", views: 169 },
    { date: "2024-04-10", views: 451 },
    { date: "2024-04-11", views: 677 },
    { date: "2024-04-12", views: 502 },
    { date: "2024-04-13", views: 722 },
    { date: "2024-04-14", views: 357 },
    { date: "2024-04-15", views: 290 },
    { date: "2024-04-16", views: 328 },
    { date: "2024-04-17", views: 806 },
    { date: "2024-04-18", views: 774 },
    { date: "2024-04-19", views: 423 },
    { date: "2024-04-20", views: 239 },
    { date: "2024-04-21", views: 337 },
    { date: "2024-04-22", views: 394 },
    { date: "2024-04-23", views: 368 },
    { date: "2024-04-24", views: 677 },
    { date: "2024-04-25", views: 465 },
    { date: "2024-04-26", views: 205 },
    { date: "2024-04-27", views: 803 },
    { date: "2024-04-28", views: 302 },
    { date: "2024-04-29", views: 555 },
    { date: "2024-04-30", views: 834 },
    { date: "2024-05-01", views: 385 },
    { date: "2024-05-02", views: 603 },
    { date: "2024-05-03", views: 437 },
    { date: "2024-05-04", views: 805 },
    { date: "2024-05-05", views: 871 },
    { date: "2024-05-06", views: 1018 },
    { date: "2024-05-07", views: 688 },
    { date: "2024-05-08", views: 359 },
    { date: "2024-05-09", views: 407 },
  ];

  const chartConfig = {
    views: {
      label: "Page Views",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <section
      className={cn("relative grid w-screen overflow-hidden py-32", className)}
    >
      <div className="relative z-10 container h-full grid-cols-1 items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-3 text-sm font-medium tracking-tight text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-green-500" />
            <span className="uppercase">new Block in 10 days</span>
          </div>
          <h1 className="mt-4 max-w-lg text-5xl font-semibold tracking-tighter lg:max-w-2xl lg:text-6xl">
            A Subscription build to fuel your Growth
          </h1>
          <p className="mt-7 max-w-lg text-muted-foreground">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="relative mt-15 flex h-20 w-full items-center justify-center border border-x-0">
          <Button className="h-12 rounded-none !px-8">Get Your Now</Button>
          <Button
            variant="ghost"
            className="flex h-12 items-center gap-3 rounded-none !px-8"
          >
            <PlayIcon />
            How it works
          </Button>
          <BgPattern />
        </div>
        <div className="h-fit w-full rounded-2xl p-6 lg:h-[50vh]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey="views" fill="#2B7FFF" />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="relative h-20 border">
          <BgPattern sideLines={false} />
        </div>
      </div>
    </section>
  );
};

export { Hero246 };

const PlayIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="15"
      height="18"
      viewBox="0 0 15 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.11523 3.94458C1.11523 2.36225 2.86573 1.40657 4.19675 2.26222L12.4982 7.59889C13.7229 8.38617 13.7229 10.1763 12.4982 10.9636L4.19675 16.3003C2.86573 17.1559 1.11523 16.2003 1.11523 14.6179V3.94458Z"
        fill="black"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BgPattern = ({ sideLines = true }: { sideLines?: boolean }) => {
  return (
    <>
      {/* bg pattern left */}
      <div
        className="absolute top-1/2 left-0 z-20 size-20 -translate-x-full -translate-y-1/2 border border-r-0"
        style={bgPattern}
      >
        <span className="absolute -top-1 -right-1 z-20 size-2 bg-foreground" />
        <span className="absolute -right-1 -bottom-1 z-20 size-2 bg-foreground" />
        <span className="absolute -bottom-1 -left-1 z-20 size-2 bg-foreground" />
        <span className="absolute -top-1 -left-1 z-20 size-2 bg-foreground" />
      </div>

      {/* bg pattern right */}
      <div
        className="absolute top-1/2 right-0 z-20 size-20 translate-x-full -translate-y-1/2 border border-l-0"
        style={bgPattern}
      >
        <span className="absolute -top-1 -right-1 z-20 size-2 bg-foreground" />
        <span className="absolute -right-1 -bottom-1 z-20 size-2 bg-foreground" />
        <span className="absolute -bottom-1 -left-1 z-20 size-2 bg-foreground" />
        <span className="absolute -top-1 -left-1 z-20 size-2 bg-foreground" />
      </div>

      {/* bg Lines left */}
      {sideLines && (
        <div className="absolute left-0 z-10 h-[200vh] w-px border-l" />
      )}
      {sideLines && (
        <div className="absolute -left-20 z-10 h-[200vh] w-px border-l" />
      )}

      {/* bg Lines right */}
      {sideLines && (
        <div className="absolute right-0 z-10 h-[200vh] w-px border-l" />
      )}
      {sideLines && (
        <div className="absolute -right-20 z-10 h-[200vh] w-px border-l" />
      )}
    </>
  );
};
