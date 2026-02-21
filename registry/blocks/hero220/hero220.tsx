"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

import { VideoText } from "@/components/magicui/video-text";

interface Hero220Props {
  className?: string;
}

const Hero220 = ({ className }: Hero220Props) => {
  return (
    <section
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-32",
        className,
      )}
    >
      <div className="container">
        <div className="absolute top-0 left-0 h-screen w-full overflow-hidden bg-[url('https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/landscape6.jpeg')] bg-cover bg-top bg-no-repeat opacity-20" />
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-[250px] w-full items-center"
          >
            <VideoText
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/landscape.mp4"
              className="font-playfair text-[15rem] font-bold tracking-tighter"
              fontFamily="Playfair Display"
            >
              Blocks
            </VideoText>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { Hero220 };
