import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageCarouselProps {
  images: { uuid: string; imageUrl: string }[];
  title: string;
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handlePrev = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    setTimeout(() => setIsTransitioning(false), 300);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-gray-100 lg:aspect-[4/5]">
        <div className="text-center text-gray-400">
          <div className="mb-2 text-6xl">📚</div>
          <p>이미지가 없습니다</p>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-t-2xl lg:aspect-[4/5] lg:rounded-l-2xl lg:rounded-tr-none">
        <Image
          src={images[0].imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="group relative aspect-square overflow-hidden rounded-t-2xl lg:aspect-[4/5] lg:rounded-l-2xl lg:rounded-tr-none">
      {/* 이미지 컨테이너 */}
      <div
        ref={containerRef}
        className="relative h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 이미지들 */}
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <div
              key={image.uuid}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? 'scale-100 opacity-100'
                  : index === (currentIndex - 1 + images.length) % images.length
                    ? '-translate-x-full scale-105 opacity-0'
                    : index === (currentIndex + 1) % images.length
                      ? 'translate-x-full scale-105 opacity-0'
                      : 'scale-110 opacity-0'
              }`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%) scale(${
                  index === currentIndex ? 1 : 1.05
                })`,
              }}
            >
              <Image
                src={image.imageUrl}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* 그라데이션 오버레이 (버튼 가시성을 위해) */}
        {/*<div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />*/}

        {/* 네비게이션 버튼 */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
          disabled={isTransitioning}
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-white"
          disabled={isTransitioning}
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      </div>

      {/* 썸네일 인디케이터 (데스크톱) */}
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md lg:flex">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'scale-125 bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* 모바일 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 lg:hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* 이미지 카운터 */}
      <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
        {currentIndex + 1} / {images.length}
      </div>

      {/* 확대 아이콘 (선택사항) */}
      <button
        onClick={() => {
          // 모달이나 전체화면 보기 로직
          console.log('확대 보기');
        }}
        className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
          />
        </svg>
      </button>
    </div>
  );
};

// 풀스크린 이미지 뷰어
const FullscreenImageViewer = ({
  images,
  currentIndex,
  isOpen,
  onClose,
}: {
  images: { uuid: string; imageUrl: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 이미지 */}
      <div className="relative flex h-full w-full items-center justify-center p-8">
        <Image
          src={images[activeIndex]?.imageUrl}
          alt="Full screen view"
          fill
          className="object-contain"
        />
      </div>

      {/* 네비게이션 */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
            className="absolute top-1/2 left-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
            className="absolute top-1/2 right-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* 하단 썸네일 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 p-2 backdrop-blur-md">
        {images.map((image, index) => (
          <button
            key={image.uuid}
            onClick={() => setActiveIndex(index)}
            className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
              index === activeIndex
                ? 'border-white'
                : 'border-transparent opacity-60'
            }`}
          >
            <Image
              src={image.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
export { FullscreenImageViewer };
