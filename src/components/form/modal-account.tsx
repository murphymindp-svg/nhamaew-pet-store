import { useState } from "react";
import Modal from "../common/Modal";
import { CalendarIcon, CheckCircle, User, X } from "lucide-react";
import Input from "@/components/ui/Input";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { cn, convertDateToThai } from "@/utils/helpers";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLineProfile, useRegisterUpdateProfile } from "@/lib/react-query/user";
import { useSession } from "next-auth/react";
import { GENDER_OPTIONS } from "@/constants";
import { LineProfileData } from "@/types/user";
import { toast, ToastContainer } from 'react-toastify';

export type AccountModalProps = {
    open: boolean;
    onClose: () => void;
    profileData?: LineProfileData
};

const formSchema = z.object({
    gender: z.string({ required_error: "กรุณาระบุเพศ" }).min(1, { message: "กรุณาระบุเพศ" }),
    dob: z.date({ required_error: "กรุณาระบุวันเกิด" }).nullish()
});

type FormData = z.infer<typeof formSchema>;

export function AccountModal({ open, onClose, profileData }: AccountModalProps) {

    const { data: session } = useSession();
    const { mutate: updateProfile, isPending: updatingProfilePending } = useRegisterUpdateProfile();

    // Helper function to convert DD-MM-YYYY string to Date object
    const parseApiDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;

        // Check if it's in DD-MM-YYYY format
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            // Create date in YYYY-MM-DD format for proper parsing
            return new Date(`${year}-${month}-${day}`);
        }

        // Fallback to regular Date parsing
        return new Date(dateString);
    };

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: profileData?.gender ?? "",
            dob: parseApiDate(profileData?.birthDate)
        },
    });

    const onSubmit = (data: FormData) => {
        if (!session?.user?.id || !session?.user?.image) {
            console.error('Missing required session data');
            return;
        }

        // Format date to string (DD-MM-YYYY format)
        const birthDate = data.dob
            ? `${String(data.dob.getDate()).padStart(2, '0')}-${String(data.dob.getMonth() + 1).padStart(2, '0')}-${data.dob.getFullYear()}`
            : '';

        updateProfile({
            lineUserId: session.user.id,
            displayName: session.user.name ?? "",
            pictureUrl: session.user.image,
            gender: data.gender,
            birthDate: birthDate
        }, {
            onSuccess: (response) => {
                toast.success('บันทึกสำเร็จ', {
                    icon: <CheckCircle className='w-5 h-5 text-success' />,
                    style: {
                        background: "#F1F9EA",
                        borderRadius: "14px",
                        fontWeight: 600,
                        color: 'black',
                        fontFamily: "notoSansThai"
                    }
                });
            },
            onError: (error) => {
                toast.error('พบข้อผิดพลาด', {
                    icon: <X className='w-5 h-5 text-critical' />,
                    style: {
                        background: "#ffc7c7",
                        borderRadius: "14px",
                        fontWeight: 600,
                        color: 'black',
                        fontFamily: "notoSansThai"
                    }
                });
            }
        });
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            form.setValue('dob', new Date(value));
        } else {
            form.setValue('dob', undefined);
        }
    };

    const formatDateForInput = (date: Date | undefined) => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    return (
        <Modal open={open} onClose={onClose} header="บัญชีของฉัน" size="md">
            <div className="flex flex-col h-full">
                {/* Form Content */}
                <div className="flex-1 flex flex-col">
                    <Form {...form}>
                        <form
                            className="flex flex-col items-center w-full h-full"
                            onSubmit={form.handleSubmit((data) => onSubmit(data))}
                        >
                            {/* Avatar */}
                            <div className="flex flex-col items-center w-full">
                                <div className="relative w-24 h-24 rounded-full flex items-center justify-center mb-6 mt-2 shadow-sm">
                                    {
                                        session ?
                                            <img src={session?.user?.image ?? ""} alt="" className="w-full h-full object-cover rounded-full" />
                                            :
                                            <User className="w-12 h-12 " />
                                    }
                                </div>
                            </div>

                            {/* Form Fields - Scrollable content */}
                            <div className={cn(
                                "w-full flex flex-col gap-4",
                                // Add padding bottom on mobile only to prevent content being hidden behind fixed buttons
                                "pb-24 md:pb-0"
                            )}>

                                <div>
                                    <FormItem>
                                        <FormLabel isRequired>
                                            ชื่อไลน์
                                        </FormLabel>
                                        <Input
                                            type="text"
                                            value={session?.user.name ?? ""}
                                            disabled
                                        />
                                        <FormMessage />
                                    </FormItem>
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel isRequired>เพศ</FormLabel>
                                                <div className="relative w-full">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                                        <User className="h-4 w-4 text-subdube" />
                                                    </span>
                                                    <select
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className={cn(
                                                            "w-full rounded-lg border border-gray-light px-4 py-2 text-base focus:outline-none pl-10",
                                                            "flex items-center justify-start text-left",
                                                            // Error styles
                                                            form.formState.errors.gender && "border-critical focus:ring-criborder-critical focus:border-critical",
                                                            // Hide default calendar icon and use custom one
                                                            "hide-date-icon")}
                                                    >
                                                        {
                                                            GENDER_OPTIONS.map((option) => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div>
                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel isRequired>วันเกิด</FormLabel>
                                                <div className="relative w-full">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                                        <CalendarIcon className="h-4 w-4 text-subdube" />
                                                    </span>

                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={formatDateForInput(field.value ?? undefined)}
                                                            onChange={handleDateChange}
                                                            className={cn(
                                                                "w-full rounded-lg border border-gray-light px-4 py-2 text-base focus:outline-none pl-10",
                                                                "flex items-center justify-start text-left",
                                                                // Error styles
                                                                form.formState.errors.dob && "border-critical focus:ring-criborder-critical focus:border-critical",
                                                                // Hide default calendar icon and use custom one
                                                                "hide-date-icon",
                                                                // Text color based on selection
                                                                field.value ? "!text-black" : "!text-transparent"
                                                            )}
                                                        />
                                                        {/* Custom placeholder when no date is selected */}
                                                        {!field.value && (
                                                            <div className="absolute inset-0 flex items-center pl-10 pointer-events-none text-black text-base">
                                                                เลือกวันเกิด
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {/* Mobile: Fixed at bottom of screen */}
                            <div className={cn(
                                "md:hidden",
                                "fixed bottom-0 left-0 right-0 bg-white px-3 md:px-6 py-4 z-50"
                            )}>
                                <div className="flex w-full gap-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="md"
                                        className="flex-1"
                                        disabled={updatingProfilePending}
                                    >
                                        {updatingProfilePending ? 'กำลังบันทึก...' : 'บันทึก'}
                                    </Button>
                                </div>
                            </div>

                            {/* Desktop: Inline buttons */}
                            <div className="hidden md:flex w-full max-w-md mx-auto gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    ยกเลิก
                                </Button>
                                <Button
                                    type="submit"
                                    size="md"
                                    className="flex-1"
                                    disabled={updatingProfilePending}
                                >
                                    {updatingProfilePending ? 'กำลังบันทึก...' : 'บันทึก'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
            </div>
        </Modal>
    );
}
