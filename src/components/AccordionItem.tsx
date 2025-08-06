import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
    title,
    children,
    defaultOpen = false
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-light">
            <button
                className="flex justify-between items-center w-full p-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-base font-medium text-gray-900">{title}</h3>

                {isOpen ? (
                    <span className='flex items-center gap-x-2'>
                        <p>ดูน้อยลง</p>
                        <ChevronUp className="h-5 w-5 text-primary" />
                    </span>
                ) : (
                    <span className='flex items-center gap-x-2'>
                        <p>ดูเพิ่มเติม</p>
                        <ChevronDown className="h-5 w-5 text-primary" />
                    </span>
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-full pb-4 px-2' : 'max-h-0'
                    }`}
            >
                {children}
            </div>
        </div>
    );
};

export default AccordionItem; 