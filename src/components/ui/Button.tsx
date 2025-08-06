import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/helpers";


const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary border border-primary text-white",
				outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary border border-secondary text-white",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-black hover:text-primary",
				calendar: "w-full rounded-lg border border-gray-light px-4 py-4 text-black text-base focus:outline-none",
			},
			size: {
				default: "px-4 py-1",
				sm: "px-3 py-1.5 text-sm",
				md: "px-4 py-2 text-base",
				lg: "px-6 py-3 text-lg",
				icon: "w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ leftIcon, rightIcon, className, variant, size, asChild = false, children, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";

		// If using asChild, let the child component handle the content
		if (asChild) {
			return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
		}

		return (
			<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
				{leftIcon && (
					<span className="inline-flex items-center">
						{leftIcon}
					</span>
				)}
				{children}
				{rightIcon && (
					<span className="inline-flex items-center">
						{rightIcon}
					</span>
				)}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
