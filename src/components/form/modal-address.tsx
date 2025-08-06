import Modal from "../common/Modal";
import Input from "@/components/ui/Input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { cn } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingAddress } from "@/types/address";
import { useEffect } from "react";

export type AddressModalProps = {
    open: boolean;
    onClose: () => void;
    onSave?: (data: ShippingAddressFormData) => void;
    shippingAddressData?: ShippingAddress;
};

const formSchema = z.object({
    recipientFullName: z.string().min(1, { message: "กรุณาระบุชื่อ-นามสกุลผู้รับ" }),
    recipientPhoneNumber: z.string().min(10, { message: "กรุณาระบุหมายเลขโทรศัพท์ให้ถูกต้อง" }),
    shippingAddress: z.string().min(1, { message: "กรุณาระบุที่อยู่สำหรับจัดส่ง" }),
    additionalAddress: z.string().optional(),
});

export type ShippingAddressFormData = z.infer<typeof formSchema>;

export function AddressModal({ open, onClose, onSave, shippingAddressData }: AddressModalProps) {
    const form = useForm<ShippingAddressFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientFullName: shippingAddressData?.recipientFullName ?? "",
            recipientPhoneNumber: shippingAddressData?.recipientPhoneNumber ?? "",
            shippingAddress: shippingAddressData?.shippingAddress ?? "",
            additionalAddress: shippingAddressData?.additionalAddress ?? "",
        },
    });

    useEffect(() => {
        if (shippingAddressData) {
            form.reset(shippingAddressData);
        }
    }, [shippingAddressData]);


    const onSubmit = (data: ShippingAddressFormData) => {
        if (onSave) {
            onSave(data);
        }
        onClose();
    }

    return (
        <Modal open={open} onClose={onClose} header="ที่อยู่จัดส่ง" size="md">
            <div className="flex flex-col h-full">
                {/* Info Text */}
                <div className="mb-6">
                    <p className="text-sm text-subdube">กรอกรายละเอียดที่อยู่จัดส่ง</p>
                </div>

                {/* Form Content */}
                <div className="flex-1 flex flex-col">
                    <Form {...form}>
                        <form
                            className="flex flex-col w-full h-full"
                            onSubmit={form.handleSubmit((data) => onSubmit(data))}
                        >
                            {/* Form Fields - Scrollable content */}
                            <div className={cn(
                                "w-full flex flex-col gap-4",
                                // Add padding bottom on mobile only to prevent content being hidden behind fixed buttons
                                "pb-24 md:pb-0"
                            )}>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="recipientFullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold" isRequired>
                                                    ชื่อ-นามสกุลผู้รับ
                                                </FormLabel>
                                                <Input
                                                    type="text"
                                                    placeholder="ระบุ"
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="recipientPhoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold" isRequired>
                                                    หมายเลขโทรศัพท์
                                                </FormLabel>
                                                <Input
                                                    type="tel"
                                                    placeholder="ระบุ"
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="shippingAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold" isRequired>
                                                    ที่อยู่สำหรับจัดส่ง
                                                </FormLabel>
                                                <textarea
                                                    placeholder="ระบุ"
                                                    className={cn(
                                                        "w-full rounded-lg border border-gray-light px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none",
                                                        "min-h-[100px]",
                                                        form.formState.errors.shippingAddress && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                                    )}
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="additionalAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold" >
                                                    ข้อมูลที่อยู่เพิ่มเติม (ถ้ามี)
                                                </FormLabel>
                                                <textarea
                                                    placeholder="ระบุ"
                                                    className={cn(
                                                        "w-full rounded-lg border border-gray-light px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none",
                                                        "min-h-[100px]"
                                                    )}
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/* Mobile: Fixed at bottom of screen */}
                            <div className={cn(
                                "w-full flex gap-4 mt-8",
                                // Mobile: Fixed at bottom of screen with shadow
                                "fixed bottom-0 left-0 right-0 p-4 bg-white  shadow-lg z-50",
                                // Hide on desktop/tablet
                                "md:hidden"
                            )}>
                                <Button
                                    type="button"
                                    variant={"secondary"}
                                    onClick={onClose}
                                    className="w-full"
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="submit"
                                    size={'md'}
                                    className="w-full"
                                >
                                    บันทึก
                                </Button>
                            </div>

                            {/* Desktop/Tablet: Normal position in modal */}
                            <div className="hidden md:flex w-full mx-auto gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant={"secondary"}
                                    className="flex-1"
                                    onClick={onClose}
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="submit"
                                    size={'md'}
                                    className="flex-1"
                                    variant={"default"}
                                >
                                    บันทึก
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
} 