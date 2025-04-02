import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookDetailAPI, updateBookAPI } from '@/lib/api/books';
import { useEffect, useState } from 'react';
import { CreateBookDto } from '@/types/books';
import { triggerToast } from '@/lib/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { validateImages } from '@/lib/utils/validation';
import { uploadImagesAPI } from '@/lib/api/files';

export const useEditBookForm = (bookId: number) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateBookDto>();

  const queryClient = useQueryClient();
  const [imageFiles, setImageFiles] = useState<
    { uuid: string; imageUrl: string }[]
  >([]);
  const router = useRouter();

  /** 책 상세 조회 쿼리 */
  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['bookDetail', bookId],
    queryFn: () => getBookDetailAPI(bookId).then((res) => res),
    enabled: !!bookId,
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

  /** 책 수정 뮤테이션 */
  const { mutate: submitUpdatedBook, isPending } = useMutation({
    mutationFn: (data: CreateBookDto) => updateBookAPI(bookId, data),
    onSuccess: () => {
      triggerToast('책 정보가 수정되었습니다.', 'success');
      queryClient.invalidateQueries({ queryKey: ['bookDetail', bookId] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      reset();
      setImageFiles([]);

      router.push(`${ROUTES.BOOK}/${bookId}`);
    },
    onError: () => {
      triggerToast('수정에 실패했습니다.', 'error');
    },
  });

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

    submitUpdatedBook(payload);
  };

  useEffect(() => {
    if (book) {
      const {
        title,
        author,
        publisher,
        price,
        status,
        description,
        bookImages,
      } = book;
      reset({
        title,
        author,
        publisher,
        price,
        status,
        description,
        imageUuids: bookImages || [],
      });
    }

    if (book?.bookImages) {
      const formatted = book.bookImages.map(
        (img: { uuid: string; imageUrl: string }) => ({
          uuid: img.uuid,
          imageUrl: img.imageUrl,
        })
      );
      setImageFiles(formatted);
    }
  }, [book]);

  return {
    handleSubmit,
    submitUpdatedBook,
    isLoading,
    isError,
    book,
    onSubmit,
    register,
    errors,
    handleImageUpload,
    imageFiles,
    removeImage,
    isPending,
    resetForm,
  };
};
