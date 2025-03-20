'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ImageInput {
  uuid: string;
  sort: number;
}

interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  price: number;
  status: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'ACCEPTABLE';
  description: string;
  imageUuids: ImageInput[];
}

export const useBookForm = () => {
  const {
    register,
    handleSubmit,
    reset, // 폼 리셋 기능 추가
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      price: 0,
      status: 'NEW',
      description: '',
      imageUuids: [],
    },
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  /** 이미지 업로드 */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  /** 이미지 삭제 */
  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /** 폼 초기화 (취소 버튼 클릭 시 실행) */
  const resetForm = () => {
    const isConfirmed = window.confirm(
      '정말 취소하시겠습니까? 입력한 내용이 모두 사라집니다.'
    );
    if (isConfirmed) {
      reset(); // 입력 필드 초기화
      setImageFiles([]); // 이미지 미리보기 초기화
    }
  };

  /** 폼 제출 */
  const onSubmit = (data: BookFormData) => {
    console.log('📦 Book Data:', data);
  };

  return {
    register,
    handleSubmit,
    errors,
    imageFiles,
    handleImageUpload,
    removeImage,
    resetForm,
    onSubmit,
  };
};
