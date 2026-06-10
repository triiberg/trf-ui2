import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/*
 * Chat message bubble. Two roles:
 *  - user      → primary-filled, right-aligned, sharp bottom-right corner
 *  - assistant → card surface with border, left-aligned, sharp bottom-left corner
 * Place messages inside a vertical flex container (e.g. `Stack`); the `self-*`
 * utilities align each bubble to its side.
 */
const chatMessageVariants = cva(
  "w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-lg px-4 py-2.5 text-sm shadow-sm",
  {
    variants: {
      role: {
        user: "self-end rounded-br-sm bg-primary font-medium text-primary-foreground",
        assistant:
          "self-start rounded-bl-sm border border-border bg-card text-card-foreground",
      },
    },
    defaultVariants: { role: "assistant" },
  }
);

export type ChatMessageRole = NonNullable<
  VariantProps<typeof chatMessageVariants>["role"]
>;

export interface ChatMessageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role">,
    VariantProps<typeof chatMessageVariants> {}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ role, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(chatMessageVariants({ role }), className)}
      {...props}
    />
  )
);
ChatMessage.displayName = "ChatMessage";

export { chatMessageVariants };
