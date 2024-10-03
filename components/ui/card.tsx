import * as React from "react";
import { motion } from "framer-motion"; // 引入 framer-motion
import 'highlight.js/styles/github.css';

import { cn } from "@/lib/utils";

const easing = [0.25, 0.1, 0.25, 1];

const MotionCard = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )}
      {...props}
    />
  ))
);
MotionCard.displayName = "MotionCard";

const MotionCardHeader = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  ))
);
MotionCardHeader.displayName = "MotionCardHeader";

const MotionCardTitle = motion(
  React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >(({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ))
);
MotionCardTitle.displayName = "MotionCardTitle";

const MotionCardDescription = motion(
  React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ))
);
MotionCardDescription.displayName = "MotionCardDescription";

const MotionCardContent = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ))
);
MotionCardContent.displayName = "MotionCardContent";

const MotionCardFooter = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ))
);
MotionCardFooter.displayName = "MotionCardFooter";

// 导出所有 motion 版本的 Card 组件
export {
  MotionCard as Card,
  MotionCardHeader as CardHeader,
  MotionCardFooter as CardFooter,
  MotionCardTitle as CardTitle,
  MotionCardDescription as CardDescription,
  MotionCardContent as CardContent,
  easing
};