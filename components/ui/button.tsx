import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = (className: string, variant: string, size: string) => {
    const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    
    let vClass = ""
    switch(variant) {
        case "default": vClass = "bg-primary text-primary-foreground shadow hover:bg-primary/90"; break;
        case "destructive": vClass = "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"; break;
        case "outline": vClass = "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"; break;
        case "secondary": vClass = "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"; break;
        case "ghost": vClass = "hover:bg-accent hover:text-accent-foreground"; break;
        case "link": vClass = "text-primary underline-offset-4 hover:underline"; break;
        case "white": vClass = "bg-white text-black hover:bg-gray-200 shadow-sm border border-transparent"; break;
        case "social": vClass = "bg-black text-white border border-zinc-800 hover:bg-zinc-900"; break;
        default: vClass = "bg-primary text-primary-foreground shadow hover:bg-primary/90";
    }

    let sClass = ""
    switch(size) {
        case "default": sClass = "h-10 px-4 py-2"; break; // Increased height to match screenshot
        case "sm": sClass = "h-8 rounded-md px-3 text-xs"; break;
        case "lg": sClass = "h-11 rounded-md px-8"; break;
        case "icon": sClass = "h-9 w-9"; break;
        default: sClass = "h-10 px-4 py-2";
    }

    return cn(base, vClass, sClass, className)
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "white" | "social"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants(className, variant, size)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }