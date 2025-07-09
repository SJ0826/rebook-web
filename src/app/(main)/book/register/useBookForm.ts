'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadImagesAPI } from '@/lib/api/files';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { postNewBookAPI } from '@/lib/api/books';
import { ROUTES } from '@/lib/constants';
import { validateImages } from '@/lib/utils/validation';
import { BookStatus, CreateBookDto } from '@/types/books';

export const useBookForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookDto>({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      price: 0,
      status: BookStatus.NEW,
      description: '',
      imageUuids: [],
    },
  });

  const [imageFiles, setImageFiles] = useState<
    { uuid: string; imageUrl: string }[]
  >([]);
  const queryClient = useQueryClient();
  const router = useRouter();

  /** 책 등록 뮤테이션 */
  const {
    mutate: submitNewBook,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: postNewBookAPI,
    onSuccess: () => {
      triggerToast('책이 성공적으로 등록되었습니다.', 'success');
      reset();
      setImageFiles([]);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      router.push(ROUTES.HOME);
    },
    onError: () => {
      triggerToast('책 등록에 실패했습니다. 다시 시도해주세요.', 'error');
    },
  });

  /** 이미지 업로드 */
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const validation = validateImages(files);
    if (!validation.valid) {
      triggerToast(validation.message);
      return;
    }

    const imageData = await uploadImagesAPI(files);
    const newImage = {
      uuid: imageData.files[0].uuid,
      imageUrl: imageData.files[0].imageUrl,
    };
    setImageFiles([...imageFiles, newImage]);
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
      reset();
      setImageFiles([]);
      router.push(ROUTES.HOME);
    }
  };

  /** 폼 제출 */
  const onSubmit = (data: CreateBookDto) => {
    const imageUuids = imageFiles.map((image, index) => {
      return { uuid: image.uuid, sort: index };
    });

    const payload: CreateBookDto = {
      ...data,
      imageUuids,
    };

    submitNewBook(payload);
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
    isPending,
    isSuccess,
    isError,
  };
};
