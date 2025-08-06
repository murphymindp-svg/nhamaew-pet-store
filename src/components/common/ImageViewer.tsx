import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ImageViewerProps {
    media: string[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onIndexChange?: (index: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
    media,
    currentIndex,
    isOpen,
    onClose,
    onIndexChange
}) => {
    const [index, setIndex] = useState(currentIndex);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

    useEffect(() => {
        setIndex(currentIndex);
    }, [currentIndex]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const isVideo = (url: string) => {
        return url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') || url.includes('video');
    };

    const handlePrevious = () => {
        const newIndex = index > 0 ? index - 1 : media.length - 1;
        setIndex(newIndex);
        onIndexChange?.(newIndex);
        setIsVideoPlaying(false);
    };

    const handleNext = () => {
        const newIndex = index < media.length - 1 ? index + 1 : 0;
        setIndex(newIndex);
        onIndexChange?.(newIndex);
        setIsVideoPlaying(false);
    };

    const toggleVideoPlay = () => {
        if (videoRef) {
            if (isVideoPlaying) {
                videoRef.pause();
            } else {
                videoRef.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowLeft':
                handlePrevious();
                break;
            case 'ArrowRight':
                handleNext();
                break;
            case 'Escape':
                onClose();
                break;
            case ' ':
                e.preventDefault();
                if (isVideo(media[index])) {
                    toggleVideoPlay();
                }
                break;
        }
    }, [isOpen, index, isVideoPlaying, media, onClose, handleNext, handlePrevious, toggleVideoPlay]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black !z-[9999] flex items-center justify-center"
                >
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                            <span className="text-base">ย้อนกลับ</span>
                        </button>

                        {/* ImageCounter */}
                        <div className="bg-secondary rounded-full text-white px-3 py-1 mt-10 text-sm absolute left-1/2 transform -translate-x-1/2">
                            {index + 1}/{media.length}
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Navigation Buttons */}
                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-secondary hover:bg-black/50 text-white p-3 rounded-full transition-colors z-10"
                                >
                                    <ChevronLeft className="w-6 md:w-10 h-6 md:h-10" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-secondary hover:bg-black/50 text-white p-3 rounded-full transition-colors z-10"
                                >
                                    <ChevronRight className="w-6 md:w-10 h-6 md:h-10" />
                                </button>
                            </>
                        )}

                        {/* Media Content */}
                        <div className="w-full h-full flex items-center justify-center p-8">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-fit max-h-fit"
                            >
                                {isVideo(media[index]) ? (
                                    <div className="relative">
                                        <video
                                            ref={setVideoRef}
                                            src={media[index]}
                                            className="max-w-full max-h-full object-contain"
                                            controls={false}
                                            onPlay={() => setIsVideoPlaying(true)}
                                            onPause={() => setIsVideoPlaying(false)}
                                            onClick={toggleVideoPlay}
                                            autoPlay
                                        />
                                        <button
                                            onClick={toggleVideoPlay}
                                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                                        >
                                            {isVideoPlaying ? (
                                                <Pause className="w-16 h-16 text-white" />
                                            ) : (
                                                <Play className="w-16 h-16 text-white" />
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <img
                                        src={media[index]}
                                        alt={`Media ${index + 1}`}
                                        className="max-w-full max-h-full object-contain"
                                        draggable={false}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageViewer; 