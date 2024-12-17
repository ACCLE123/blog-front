/* eslint-disable react/display-name */

import * as React from "react";
import { motion } from "framer-motion"; // 引入 framer-motion
import 'highlight.js/styles/github.css';

import { cn } from "@/lib/utils";

const easing = [0.25, 0.1, 0.25, 1];

const Card = motion(
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

const CardHeader = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 w-full max-w-4xl mx-auto", className)}
      {...props}
    />
  ))
);

const CardTitle = motion(
  React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >(({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight w-full max-w-4xl mx-auto", className)}
      {...props}
    />
  ))
);

const CardDescription = motion(
  React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground w-full max-w-4xl mx-auto", className)}
      {...props}
    />
  ))
);

const CardContent = motion(
  React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0 w-full max-w-4xl mx-auto", // 设置最大宽度，并使其居中
        className
      )}
      {...props}
    />
  ))
);

const CardFooter = motion(
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

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  easing
};