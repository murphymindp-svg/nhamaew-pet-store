import React from 'react';
import AccordionItem from './AccordionItem';
import { ProductDetail } from '@/types/product';

interface ProductAccordionProps {
    productDetails: ProductDetail;
}

const ProductAccordion: React.FC<ProductAccordionProps> = ({ productDetails }) => {
    const {
        productName,
        productDetails: description,
        productSuitableFor,
        ingredients,
        nutritionalInfo,
        recommend,
        otherRecommend,
        cautions,
        otherProductInfo,
        frequentlyAskedQuestions,
        sold,
        productBalance,
        averageReviewScore,
        fileList
    } = productDetails;

    return (
        <div className="bg-white divide-y divide-gray-200">
            <h3 className="text-xl font-semibold border-b border-gray-light py-3 px-4">เกี่ยวกับสินค้า</h3>

            <AccordionItem title="รายละเอียดสินค้า">
                <p className="text-base text-black whitespace-pre-line px-2">
                    {description}
                </p>
            </AccordionItem>

            {productSuitableFor && (
                <AccordionItem title="สินค้าเหมาะสำหรับ">
                    <p className="text-base text-black whitespace-pre-line px-2">{productSuitableFor}</p>
                </AccordionItem>
            )}

            {ingredients && (
                <AccordionItem title="ส่วนประกอบ/ส่วนผสม">
                    <p className="text-base text-black whitespace-pre-line px-2">{ingredients}</p>
                </AccordionItem>
            )}

            {nutritionalInfo && (
                <AccordionItem title="ข้อมูลทางโภชนาการ">
                    <p className="text-base text-black whitespace-pre-line px-2">{nutritionalInfo}</p>
                </AccordionItem>
            )}

            {recommend && (
                <AccordionItem title="วิธีใช้และคำแนะนำในการใช้ / การทาน">
                    <p className="text-base text-black whitespace-pre-line px-2">{recommend}</p>
                </AccordionItem>
            )}

            {otherRecommend && (
                <AccordionItem title="คำแนะนำอื่นๆ">
                    <p className="text-base text-black whitespace-pre-line px-2">{otherRecommend}</p>
                </AccordionItem>
            )}

            {cautions && (
                <AccordionItem title="ข้อควรระวัง และข้อห้ามในการทาน / การใช้">
                    <p className="text-base text-black whitespace-pre-line px-2">{cautions}</p>
                </AccordionItem>
            )}

            {otherProductInfo && (
                <AccordionItem title="ข้อมูลอื่นๆของสินค้า">
                    <p className="text-base text-black whitespace-pre-line px-2">{otherProductInfo}</p>
                </AccordionItem>
            )}

            {frequentlyAskedQuestions && (
                <AccordionItem title="คำถามที่พบบ่อย (FAQ)">
                    <p className="text-base text-black whitespace-pre-line px-2">{frequentlyAskedQuestions}</p>
                </AccordionItem>
            )}


            {/* {additionalInfo && Object.keys(additionalInfo).map((key, index) => (
                <AccordionItem key={index} title={`เกี่ยวกับสินค้า ${String(key).padStart(2, '0')}`}>
                    <p className="text-sm text-gray-700">{additionalInfo[key]}</p>
                </AccordionItem>
            ))} */}
        </div>
    );
};

export default ProductAccordion; 