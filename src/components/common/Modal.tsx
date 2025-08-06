import React, { JSX, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, X } from "lucide-react";

import { cn } from "@/utils/helpers";

type ModalProps = {
	open: boolean;
	header?: string;
	subHeader?: string;
	children: JSX.Element;
	size?: "sm" | "md" | "lg";
	multiple?: boolean;
	onClose?: () => void;
	canClickOutside?: boolean;
};

export default function Modal({ open, header, subHeader, children, size = "md", multiple = false, onClose, canClickOutside = true }: ModalProps) {
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
						<div className="fixed inset-0 flex items-center justify-center z-50">
							<Dialog.Overlay
								forceMount
								asChild
								className={cn(
									multiple ? "z-[1002]" : "z-[1000]",
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
								onPointerDownOutside={canClickOutside ? undefined : avoidDefaultDomBehavior}
								onInteractOutside={canClickOutside ? undefined : avoidDefaultDomBehavior}
								className={cn(
									multiple ? "z-[1003]" : "z-[1001]",
									"w-screen h-screen max-w-full max-h-full rounded-none m-0",
									"sm:w-full sm:h-full sm:max-w-5xl sm:max-h-[90vh] sm:rounded-xl sm:my-auto",
									size == "sm"
										? "sm:max-w-sm"
										: size == "md"
											? "sm:max-w-2xl sm:max-h-fit"
											: "sm:max-w-4xl sm:max-h-fit",
									"data-[state=open]:animate-contentShow relative mx-auto bg-white pb-6 shadow-xl focus:outline-none"
								)}
							>
								<motion.div
									initial={{ scale: 0.95, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
									transition={{ duration: 0.25 }}
									className="dialog-body w-full"
								>
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{
											delay: 0.1,
										}}
									>
										<Dialog.Title />
										<Dialog.Description />
										<div
											className={cn(
												"px-4 md:px-6 flex items-center py-6",
												onClose != null
													? "justify-between border-b border-gray-light"
													: "justify-start"
											)}
										>
											<div className="flex flex-col gap-y-1 justify-center">
												<h1 className="text-xl font-semibold text-black">{header}</h1>
												{subHeader && <p className="text-[12px] text-subdube">{subHeader}</p>}
											</div>
											{onClose != null && (
												<button
													onClick={onClose}
													className="flex gap-x-1 items-center rounded-full text-black hover:text-subdube"
												>
													<X className="h-6 w-6 hidden lg:block" />
													<ChevronLeft className="h-6 w-6 lg:hidden" />
													<span className="ml-1 hidden lg:block">ปิด</span>
													<span className="ml-1 lg:hidden">ย้อนกลับ</span>
												</button>
											)}
										</div>
										<div className="md:max-h-[70vh] md:h-full h-screen overflow-y-auto px-4 md:px-6 pt-6 md:pb-0 pb-4">{children}</div>
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
