import { JSX } from "react";

import {
    PopoverContent,
    PopoverTrigger,
    Popover as PopoverUI,
} from "@/components/ui/Popover";
import { cn } from "@/utils/helpers";

type PopoverType = {
    type?: "modal" | "calendar";
    trigger: JSX.Element | JSX.Element[];
    header?: string;
    side?: "right" | "top" | "bottom" | "left" | undefined;
    children: JSX.Element | JSX.Element[];
};

export default function Popover(props: PopoverType) {

    const { type = "modal", trigger, header, side = "right", children } = props;

    return (
        <PopoverUI>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
                align="start"
                avoidCollisions={true}
                side={side}
                className={cn(
                    type == "modal"
                        ? "max-w-[500px] min-w-[412px] p-6"
                        : "w-auto"
                )}
            >
                {type == "modal" ? (
                    <>
                        <div className="header border-gray mb-6 border-b pb-6">
                            <p className="font-semibold">{header}</p>
                        </div>
                        <div className="content">{children}</div>
                    </>
                ) : (
                    children
                )}
            </PopoverContent>
        </PopoverUI>
    );
}
