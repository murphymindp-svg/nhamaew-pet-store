'use client';

import React from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AlertModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    type?: 'success' | 'error' | 'warning' | 'info';
};

export default function AlertModal({
    open,
    onClose,
    title = "เพิ่มสินค้าไปยังตะกร้าเรียบร้อย",
    message = "คุณสามารถตรวจสอบสินค้าก่อนการซื้อได้",
    primaryButtonText = "ตรวจสอบสินค้าในตะกร้า",
    secondaryButtonText = "เลือกซื้อสินค้าต่อ",
    onPrimaryAction,
    onSecondaryAction,
    type = 'success'
}: AlertModalProps) {

    const handlePrimaryAction = () => {
        if (onPrimaryAction) {
            onPrimaryAction();
        }
        onClose();
    };

    const handleSecondaryAction = () => {
        if (onSecondaryAction) {
            onSecondaryAction();
        }
        onClose();
    };

    const getIconColor = () => {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            case 'info': return 'bg-blue-500';
            default: return 'bg-green-500';
        }
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                            <Dialog.Overlay
                                forceMount
                                asChild
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </Dialog.Overlay>

                            <Dialog.Content
                                asChild
                                forceMount
                                className="relative bg-white rounded-2xl shadow-xl max-w-sm mx-4 w-full focus:outline-none"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-6 text-center"
                                >
                                    {/* Success Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div className={`w-16 h-16 ${getIconColor()} rounded-full flex items-center justify-center`}>
                                            <Check className="w-8 h-8 text-white" strokeWidth={3} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                                        {title}
                                    </Dialog.Title>

                                    {/* Message */}
                                    <Dialog.Description className="text-sm text-gray-600 mb-8">
                                        {message}
                                    </Dialog.Description>

                                    {/* Buttons */}
                                    <div className="space-y-3">
                                        <Button
                                            onClick={handlePrimaryAction}
                                            className="w-full"
                                        >
                                            {primaryButtonText}
                                        </Button>

                                        <Button
                                            onClick={handleSecondaryAction}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            {secondaryButtonText}
                                        </Button>
                                    </div>
                                </motion.div>
                            </Dialog.Content>
                        </div>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
} 