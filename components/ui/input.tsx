import * as React from "react";
import { motion, MotionProps } from "framer-motion"; // 引入 framer-motion
import { cn } from "@/lib/utils";

// 定义缓动曲线，符合 Apple 风格
const easing = [0.25, 0.1, 0.25, 1];

// 定义带有 motion 支持的 Input 组件，合并 HTML 属性和 Motion 属性
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & MotionProps
>(({ className, type, ...props }, ref) => {
  return (
    <motion.input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      whileFocus={{
        scale: 1.02, // 焦点时轻微放大
        transition: { duration: 0.3, ease: easing },
      }}
      whileHover={{
        scale: 1.01, // 悬停时略微放大
        transition: { duration: 0.2, ease: easing },
      }}
    />
  );
});
Input.displayName = "Input";

export { Input };