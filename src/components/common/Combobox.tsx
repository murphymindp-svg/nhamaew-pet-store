"use client";

import * as React from "react";
import { CheckCircle, ChevronsUpDown } from "lucide-react";
import { FieldError } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { cn } from "@/utils/helpers";
import { MasterSelectProps } from "@/types/global";

type ComboBoxProps = {
	options?: MasterSelectProps[];
	placeholder?: string;
	value?: string | number | null;
	valueType?: "string" | "number";
	onChange?: (value: string | number) => void;
	isError?: FieldError;
	disabled?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	className?: string;
};

export function Combobox(props: ComboBoxProps) {
	const {
		options,
		placeholder = "- เลือก -",
		value,
		valueType = "number",
		onChange,
		isError = false,
		disabled = false,
		leftIcon,
		rightIcon,
		className = "",
	} = props;
	const [open, setOpen] = React.useState(false);
	const selectedOption = options?.find((option) => option.value == value);

	return (
		<div className="relative w-full">
			{leftIcon && (
				<span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
					{leftIcon}
				</span>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						role="combobox"
						aria-expanded={open}
						aria-controls="combobox-listbox"
						aria-haspopup="listbox"
						disabled={disabled}
						className={cn(
							// Base styles matching Input component
							"w-full rounded-lg border border-gray-light px-4 py-2 text-base focus:outline-none",
							// Text alignment and display
							"flex items-center justify-between text-left",
							// Focus styles
							// Disabled styles
							"disabled:opacity-50 disabled:cursor-not-allowed",
							// Error styles
							isError ? "border-critical focus:ring-critical focus:border-critical" : "",
							// Icon padding adjustments
							leftIcon ? "pl-10" : "",
							rightIcon ? "pr-10" : "", // Always leave space for chevron + potential rightIcon
							// Placeholder styles
							selectedOption ? "text-gray-900" : "text-gray-500",
							// Custom className
							className
						)}
					>
						<span className="block truncate">
							{selectedOption !== undefined ? selectedOption?.label : placeholder}
						</span>
						<span className="flex items-center">
							{rightIcon && <span className="mr-2">{rightIcon}</span>}
							<ChevronsUpDown className="h-4 w-4 text-gray-400" />
						</span>
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
					<Command>
						<CommandInput placeholder={`ค้นหา${placeholder}...`} className="border-none focus:ring-0" />
						<CommandList id="combobox-listbox" role="listbox">
							<CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
							<CommandGroup>
								{options?.map((option, index) => (
									<CommandItem
										value={String(option.label)}
										key={index}
										onSelect={(currentValue) => {
											const value = options?.find(
												(option) => option.label.toLowerCase() == currentValue.toLowerCase()
											)?.value;
											onChange?.(valueType == "string" ? String(value!) : Number(value!));
											setOpen(false);
										}}
										className={cn(
											"flex items-center justify-between cursor-pointer px-3 py-2 transition-colors duration-150",
											"hover:bg-primary-light hover:text-primary-dark",
											"data-[selected=true]:bg-primary-light data-[selected=true]:text-primary-dark",
											value == option.value
												? "bg-primary-light text-primary-dark font-medium"
												: "text-gray-700"
										)}
									>
										<span>{option.label}</span>
										<CheckCircle
											className={cn(
												"h-4 w-4",
												value == option.value ? "opacity-100 text-primary" : "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
