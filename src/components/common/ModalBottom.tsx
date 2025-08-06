import React, { JSX, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/utils/helpers";

type ModalBottomProps = {
	open: boolean;
	header?: string;
	children: JSX.Element;
	size?: "sm" | "md" | "lg";
	multiple?: boolean;
	zIndex?: string;
	onClose?: () => void;
};

export default function ModalBottom({ open, header, children, size = "md", multiple = false, zIndex = "z-[1001]", onClose }: ModalBottomProps) {
	useEffect(() => {
		if (open) {
			// Pushing the change to the end of the call stack
			const timer = setTimeout(() => {
				document.body.style.pointerEvents = "";
			}, 0);

			return () => clearTimeout(timer);
		} else {
			document.body.style.pointerEvents = "auto";
		}
	}, [open]);

	const avoidDefaultDomBehavior = (e: Event) => {
		e.preventDefault();
	};

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen && onClose) onClose();
			}}
		>
			<AnimatePresence>
				{open && (
					<Dialog.Portal forceMount>
						<div className={`fixed inset-0 flex flex-col justify-end lg:items-center lg:justify-center ${zIndex}`}>
							<Dialog.Overlay
								forceMount
								asChild
								className={cn(
									zIndex,
									"data-[state=open]:animate-overlayShow fixed inset-0 h-full w-screen bg-black/40 backdrop-blur-[2px]"
								)}
							>
								<motion.div
									className="backdrop"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{
										duration: 0.2,
									}}
								/>
							</Dialog.Overlay>
							<Dialog.Content
								asChild
								forceMount
								onPointerDownOutside={avoidDefaultDomBehavior}
								onInteractOutside={avoidDefaultDomBehavior}
								className={cn(
									multiple ? "z-[1003]" : "z-[1001]",
									// Mobile/Tablet: fixed bottom with rounded top corners
									"w-full max-w-full rounded-t-2xl",
									// Desktop: centered modal with all rounded corners
									"lg:rounded-xl lg:my-auto",
									size == "sm"
										? "lg:max-w-sm"
										: size == "md"
											? "lg:max-w-2xl lg:max-h-[80vh]"
											: "lg:max-w-3xl lg:max-h-[85vh]",
									"data-[state=open]:animate-contentShow relative bg-white shadow-xl focus:outline-none"
								)}
							>
								<motion.div
									initial={{
										y: "100%", // Slide up from bottom on mobile
										opacity: 0
									}}
									animate={{
										y: 0,
										opacity: 1
									}}
									exit={{
										y: "100%", // Slide down to bottom on mobile
										opacity: 0,
										transition: { duration: 0.2 }
									}}
									transition={{
										duration: 0.25,
										type: "spring",
										damping: 25,
										stiffness: 300
									}}
									className="dialog-body w-full flex flex-col"
								>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											delay: 0.1,
										}}
										className="flex flex-col h-full"
									>
										<Dialog.Title />
										<Dialog.Description />

										{/* Header */}
										<div
											// className={cn(
											// 	"px-4 md:px-6 flex items-center py-6 flex-shrink-0",
											// 	onClose != null
											// 		? "justify-between border-b border-gray-light"
											// 		: "justify-start"
											// )}
											className={cn(
												"px-4 md:px-6 flex items-center pt-3 pb-0 flex-shrink-0 justify-end"
											)}
										>
											{/* <h1 className="text-xl font-semibold text-black">{header}</h1> */}
											{onClose != null && (
												<button
													onClick={onClose}
													className="flex gap-x-1 items-center rounded-full text-black hover:text-subdube"
												>
													<X className="size-5" />
													ปิด
												</button>
											)}
										</div>

										{/* Content */}
										<div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
											{children}
										</div>
									</motion.div>
								</motion.div>
							</Dialog.Content>
						</div>
					</Dialog.Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
}
