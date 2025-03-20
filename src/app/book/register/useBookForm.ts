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
    watch,
    setValue,
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
    onSubmit,
  };
};
