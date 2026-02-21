"use client";

import { Shield, Users, Zap } from "lucide-react";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

import { cn } from "@/lib/utils";

const TECH_ICONS = [
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vue-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/svelte.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/solidjs.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vite-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon-black.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/graphql.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/postgresql.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/mongodb.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/redis.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/python-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vscode-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/cursor-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/openai-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/claude-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/gemini-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/laravel.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/remix-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/gatsby-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nuxt.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/neon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/redwoodjs.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg",
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/brave-icon.svg",
];

interface Hero236Props {
  className?: string;
}

const Hero236 = ({ className }: Hero236Props) => {
  const stats = [
    {
      icon: <Users className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: "+100k",
      description: "Daily Users",
    },
    {
      icon: <Zap className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: "99.9%",
      description: "Uptime ",
    },
    {
      icon: <Shield className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: "24/7",
      description: " Support",
    },
  ];

  const images = TECH_ICONS;

  return (
    <section
      className={cn("relative w-screen overflow-hidden py-32", className)}
    >
      <div className="container flex flex-col lg:flex-row">
        <div className="mt-10 space-y-12 lg:w-1/2">
          <p className="w-fit rounded-full bg-muted px-4 py-1 text-sm uppercase">
            Why Us?
          </p>
          <h1 className="mt-3 max-w-lg font-calSans text-6xl font-medium lg:text-7xl">
            <span className="opacity-30">The Only blocks</span> you need
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <ul className="mt-18 flex flex-wrap gap-9">
            {stats.map((stat, index) => (
              <li key={stat.title} className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl border md:size-18">
                  {stat.icon}
                </div>
                <div>
                  <h2 className="font-calSans text-2xl font-medium md:text-3xl">
                    {stat.title}
                  </h2>
                  <p className="text-sm md:text-base">{stat.description}</p>
                </div>
                {index !== stats.length - 1 && (
                  <div className="ml-4 h-full w-px bg-gradient-to-t from-primary via-border to-transparent" />
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex h-[500px] w-full items-center justify-center overflow-hidden lg:w-1/2">
          <div className="absolute flex h-full w-full items-center justify-center">
            <IconCloud images={images} />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero236 };

// Below is the modified component from magic UI
// Original source: npx shadcn@latest add npx shadcn@latest add "https://magicui.design/r/icon-cloud"
// Modified to follow our coding standards and design system
// We respect copyright and attribution to the original creators

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  icons?: React.ReactNode[];
  images?: string[];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ icons, images }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [rotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const animationFrameRef = useRef<number>(0);
  const rotationRef = useRef(rotation);
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return;

    const items = icons || images || [];
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        if (images) {
          // Handle image URLs directly
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = items[index] as string;
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

            // Create circular clipping path
            offCtx.beginPath();
            offCtx.arc(20, 20, 20, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();

            // Draw the image
            offCtx.drawImage(img, 0, 0, 40, 40);

            imagesLoadedRef.current[index] = true;
          };
        } else {
          // Handle SVG icons
          offCtx.scale(0.4, 0.4);
          const svgString = renderToString(item as React.ReactElement);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + btoa(svgString);
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            offCtx.drawImage(img, 0, 0);
            imagesLoadedRef.current[index] = true;
          };
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [icons, images]);

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = icons || images || [];
    const newIcons: Icon[] = [];
    const numIcons = items.length || 20;

    // Fibonacci sphere parameters
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * 180,
        y: y * 180,
        z: z * 180,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    startTransition(() => {
      setIconPositions(newIcons);
    });
  }, [icons, images]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = e.clientX + rect.left;
    const y = e.clientY + rect.top;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvasRef.current!.width / 2 + rotatedX;
      const screenY = canvasRef.current!.height / 2 + rotatedY;

      const scale = (rotatedZ + 200) / 300;
      const radius = 20 * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z),
        );
        const targetY = Math.atan2(icon.x, icon.z);

        const currentX = rotationRef.current.x;
        const currentY = rotationRef.current.y;
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2),
        );

        const duration = Math.min(2000, Math.max(800, distance * 1000));

        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        });
        return;
      }
    });

    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };

      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
      const dx = mousePos.x + centerX;
      const dy = mousePos.y + centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.001 + (distance / maxDistance) * 0.0015;

      if (targetRotation) {
        const elapsed = performance.now() - targetRotation.startTime;
        const progress = Math.min(1, elapsed / targetRotation.duration);
        const easedProgress = easeOutCubic(progress);

        rotationRef.current = {
          x:
            targetRotation.startX +
            (targetRotation.x - targetRotation.startX) * easedProgress,
          y:
            targetRotation.startY +
            (targetRotation.y - targetRotation.startY) * easedProgress,
        };

        if (progress >= 1) {
          setTargetRotation(null);
        }
      } else if (!isDragging) {
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      iconPositions.forEach((icon, index) => {
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const scale = (rotatedZ + 200) / 300;
        const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));

        ctx.save();
        ctx.translate(
          canvas.width / 2 + rotatedX,
          canvas.height / 2 + rotatedY,
        );
        ctx.scale(scale, scale);
        ctx.globalAlpha = opacity;

        if (icons || images) {
          // Only try to render icons/images if they exist
          if (
            iconCanvasesRef.current[index] &&
            imagesLoadedRef.current[index]
          ) {
            ctx.drawImage(iconCanvasesRef.current[index], -20, -20, 50, 50);
          }
        } else {
          // Show numbered circles if no icons/images are provided
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = "#4444ff";
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "16px Arial";
          ctx.fillText(`${icon.id + 1}`, 0, 0);
        }

        ctx.restore();
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [icons, images, iconPositions, isDragging, mousePos, targetRotation]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="rounded-lg"
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}
