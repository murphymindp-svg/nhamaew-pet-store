'use client';

import React, { useState } from 'react';
import { CheckCircle, Minus, Pencil, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { AddressModal, ShippingAddressFormData } from '@/components/form/modal-address';
import CartFooter from '@/components/CartFooter';
import { swal } from '@/components/common/SweetAlert';
import { useRouter } from 'next/navigation';
import { useCreateOrder, useDeleteCartItem, useMyCart, useUpdateCartItemQuantity } from '@/lib/react-query/cart';
import { useShippingAddress, useUpdateShippingAddress } from '@/lib/react-query/address';
import { toast, ToastContainer } from 'react-toastify';
import { useSession } from 'next-auth/react';



export default function MyCartPage() {

    const { push } = useRouter();
    const { data: session } = useSession();

    const lineUserId = session?.user?.id;

    const { data: myCartData } = useMyCart({ lineUserId: lineUserId ?? "" });
    const { data: shippingAddressData } = useShippingAddress({ lineUserId: lineUserId ?? "" });
    const { mutate: updateShippingAddress, isPending: isUpdatingShippingAddress } = useUpdateShippingAddress();
    const { mutate: deleteCartItem } = useDeleteCartItem();
    const { mutate: updateCartItemQuantity } = useUpdateCartItemQuantity();
    const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

    // Address modal state
    const [showAddressModal, setShowAddressModal] = useState(false);

    // Calculate totals from real cart data
    const subtotal = myCartData?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
    const originalTotal = myCartData?.reduce((total, item) => total + ((item.originalPrice || item.price) * item.quantity), 0) || 0;
    const totalSavings = originalTotal - subtotal;
    const totalItems = myCartData?.reduce((total, item) => total + item.quantity, 0) || 0;
    const total = subtotal;

    // Handlers
    const increaseQuantity = (id: number) => {
        const item = myCartData?.find(item => item.id === id);
        if (item && lineUserId) {
            updateCartItemQuantity({
                id: id,
                lineUserId: lineUserId,
                quantity: item.quantity + 1
            });
        }
    };

    const decreaseQuantity = (id: number) => {
        const item = myCartData?.find(item => item.id === id);
        if (item && item.quantity > 1 && lineUserId) {
            updateCartItemQuantity({
                id: id,
                lineUserId: lineUserId,
                quantity: item.quantity - 1
            });
        }
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity > 0 && lineUserId) {
            updateCartItemQuantity({
                id: id,
                lineUserId: lineUserId,
                quantity: newQuantity
            });
        }
    };

    const removeItem = (id: number) => {
        deleteCartItem({ id: id });
    };

    const handleEditAddress = () => {
        setShowAddressModal(true);
    };

    const handleSaveAddress = async (data: ShippingAddressFormData) => {
        updateShippingAddress({
            lineUserId: lineUserId ?? "",
            ...data,
            additionalAddress: data.additionalAddress ?? ""
        }, {
            onSuccess() {
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
            onError() {
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
    };

    const handleSendToAdmin = async () => {
        // Validate required data
        if (!lineUserId) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
            return;
        }

        if (!myCartData || myCartData.length === 0) {
            toast.error('ไม่มีสินค้าในตะกร้า');
            return;
        }

        if (!shippingAddressData || Object.keys(shippingAddressData).length === 0) {
            toast.error('กรุณาเพิ่มที่อยู่จัดส่งก่อนทำการสั่งซื้อ');
            return;
        }

        try {
            // Transform cart data to order format
            // Note: We need to check if MyCartData has productItemId field
            // If not, we need to update the type or get it from elsewhere
            const orderItemList = myCartData.map(item => ({
                productItemId: item.productItemId || "", // This field might be missing from MyCartData type
                productItemQuantityId: item.productItemQuantityId || "",
                productQuantityId: item.productQuantityId || "",
                quantity: item.quantity
            }));

            const orderData = {
                lineUserId: lineUserId,
                orderItemList: orderItemList
            };


            // Create the order
            createOrder(orderData, {
                onSuccess: (result) => {
                    swal.fire({
                        icon: "success",
                        title: "สำเร็จ",
                        text: "ส่งรายการสินค้าให้แอดมินเรียบร้อยแล้ว หน้านี้จะถูกปิดลงและพาคุณกลับไปที่ไลน์เพื่อแชทกับแอดมิน",
                        confirmButtonText: "ตกลง",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            push('/history');
                        }
                    });
                },
                onError: (error) => {
                    swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
                        confirmButtonText: "ตกลง",
                    });
                }
            });

        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการเตรียมข้อมูลคำสั่งซื้อ');
        }
    };

    return (
        <section className='md:py-24'>
            <div className="lg:container mx-auto space-y-8 md:py-5 py-1 md:px-5 px-3 pb-40">
                {/* Address Section */}
                <div className="grid grid-cols-2 gap-x-4">
                    <div className="sm:col-span-1 col-span-2">
                        <div className="bg-white mb-4 p-4 rounded-lg">
                            {
                                shippingAddressData && Object.keys(shippingAddressData).length > 0 ? (
                                    <div className="flex items-start">
                                        <img src="/icons/cart-pin.svg" alt="pin" className="w-7 h-7" />
                                        <div className="flex-grow">
                                            <p className="text-black text-baese font-semibold">{shippingAddressData.recipientFullName}</p>
                                            <p className="text-subdube text-sm">{shippingAddressData.recipientPhoneNumber}</p>
                                            <p className="text-black text-sm">
                                                {shippingAddressData.shippingAddress}
                                                {shippingAddressData.additionalAddress && (
                                                    <>
                                                        <br />
                                                        {shippingAddressData.additionalAddress}
                                                    </>
                                                )}
                                            </p>
                                            <p>

                                            </p>
                                        </div>
                                        <button
                                            className="flex items-center gap-x-1 text-secondary text-sm font-semibold"
                                            onClick={handleEditAddress}
                                        >
                                            <Pencil className='w-4 h-4' />
                                            แก้ไข
                                        </button>
                                    </div>
                                )
                                    :
                                    <div className='flex items-center justify-center h-full py-3'>

                                        <button type='button' onClick={handleEditAddress} className="flex items-center gap-x-1">
                                            <Plus className='w-4 h-4' />
                                            <p className='text-primary'>เพิ่มที่อยู่จัดส่ง</p>
                                        </button>
                                    </div>
                            }

                        </div>

                        {/* Cart Items */}
                        {myCartData?.map((item) => (
                            <div key={item.id} className="bg-white mb-4 rounded-lg">
                                <div className="p-4">
                                    <div className="flex items-start mb-2">
                                        <div className="mr-3 w-20 h-20 flex-shrink-0 border border-gray-light rounded-[14px]">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.productName}
                                                width={80}
                                                height={80}
                                                className="object-contain w-full h-full rounded-[14px]"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col">
                                                    <h3 className="font-semibold text-sm line-clamp-2 pr-4">{item.productName}</h3>
                                                    <p className='text-sm text-subdube'>
                                                        {item.productItemName ? item.productItemName : item.productQuantityName} {item.productItemQuantityName}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    aria-label="Remove item"
                                                >
                                                    <X size={18} className="text-primary" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center mt-2">
                                            <div className='flex flex-col justify-center items-start gap-x-1'>
                                                <div className="text-primary font-semibold text-base">฿{item.price ? item.price.toLocaleString() : 0}</div>
                                                <p className='text-xs text-subdube'>สามารถกรอกจำนวนที่ช่องกรอกได้</p>
                                            </div>
                                            <div className="flex items-center justify-end gap-x-2">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="w-10 h-10 text-white bg-secondary rounded-full flex items-center justify-center hover:bg-gray-800"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 1;
                                                        updateQuantity(item.id, value);
                                                    }}
                                                    onFocus={e => e.target.select()}
                                                    className="w-10 h-10  text-center bg-white outline-none border border-gray-light rounded-[10px]"
                                                />
                                                <button
                                                    onClick={() => increaseQuantity(item.id)}
                                                    className="w-10 h-10 text-white bg-secondary rounded-full flex items-center justify-center hover:bg-gray-800"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="sm:col-span-1 col-span-2">
                        {/* Order Summary */}
                        <div className="bg-white mb-4 p-4 rounded-lg">
                            <h3 className="font-semibold text-base mb-3">สรุปคำสั่งซื้อ</h3>
                            <div className="flex justify-between mb-2">
                                <span className='text-sm text-black'>รวมการสั่งซื้อ</span>
                                <span className="text-sm text-black">฿{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-gray-500">
                                <span className='text-sm text-black'>ไม่รวมค่าจัดส่ง</span>
                                <span> </span>
                            </div>
                            <div className="border-t border-gray-light my-2 pt-2">
                                <div className="flex justify-between font-semibold">
                                    <span className='text-sm text-black'>ยอดชำระเงินทั้งหมด</span>
                                    <span className="text-black font-semibold">฿{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Modal */}
                <AddressModal
                    open={showAddressModal}
                    shippingAddressData={shippingAddressData}
                    onClose={() => setShowAddressModal(false)}
                    onSave={handleSaveAddress}

                />
            </div>

            {/* Cart Footer */}
            <CartFooter
                totalSavings={totalSavings}
                onSendToAdmin={handleSendToAdmin}
                totalItems={totalItems}
                totalAmount={total}
                isLoading={isCreatingOrder}
            />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
        </section>
    );
}
