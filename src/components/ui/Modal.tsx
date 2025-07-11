'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@headlessui/react';
import { useModalStack } from '@/hooks/useModalStack';

export interface IProps {
  hasHeader?: boolean;
  title?: string; // 헤더가 있을 때만 적용
  size?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = ({ hasHeader, title, size, children, footer }: IProps) => {
  // 활성 모달 수를 추적하기 위한 전역 변수
  let activeModalsCount = 0;
  const { clear } = useModalStack();

  useEffect(() => {
    // 모달이 마운트될 때 카운터 증가
    activeModalsCount++;
    document.body.style.overflow = 'hidden';

    // 모달이 언마운트될 때 카운터 감소
    return () => {
      activeModalsCount--;
      // 마지막 모달이 닫힐 때만 스크롤 활성화
      if (activeModalsCount === 0) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [activeModalsCount]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.1 }}
          className={twMerge(
            'relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl',
            size ? size : 'w-[360px]'
          )}
        >
          {/* 모달 컨테이너 */}
          <div className="flex flex-col">
            {/* 헤더 */}
            {hasHeader && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-6">
                <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
                  {title}
                </h2>
                <Button
                  onClick={() => {
                    clear();
                  }}
                  className="rounded-full p-1 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  aria-label="모달 닫기"
                >
                  <XMarkIcon className={'h-6 w-6'} />
                </Button>
              </div>
            )}

            {/* 컨텐츠 */}
            <div className={'px-8 py-6'}>{children}</div>

            {/* 푸터 */}
            {footer}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
