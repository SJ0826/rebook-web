'use client';

import { useBookForm } from './useBookForm';
import Image from 'next/image';

export default function BookForm() {
  const {
    register,
    handleSubmit,
    errors,
    imageFiles,
    handleImageUpload,
    removeImage,
    onSubmit,
  } = useBookForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* 제목 */}
      <label className="form-control w-full md:flex md:flex-row items-start">
        <span className="label-text min-w-[120px]">책 제목</span>
        <div className={'w-full flex flex-col gap-1'}>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('title', { required: '책 제목을 입력하세요.' })}
          />
          {errors.title && (
            <span className="text-error">{errors.title.message}</span>
          )}
        </div>
      </label>

      {/* 저자 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">저자</span>
        <div className={'w-full flex flex-col gap-1'}>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('author', { required: '저자를 입력하세요.' })}
          />
          {errors.author && (
            <span className="text-error">{errors.author.message}</span>
          )}
        </div>
      </label>

      {/* 출판사 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">출판사</span>
        <div className={'w-full flex flex-col gap-1'}>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('publisher', { required: '출판사를 입력하세요.' })}
          />
          {errors.publisher && (
            <span className="text-error">{errors.publisher.message}</span>
          )}
        </div>
      </label>

      {/* 가격 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">가격 (₩)</span>
        <div className={'w-full flex flex-col gap-1'}>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register('price', {
              required: '가격을 입력하세요.',
              min: { value: 0, message: '가격은 0 이상이어야 합니다.' },
            })}
          />
          {errors.price && (
            <span className="text-error">{errors.price.message}</span>
          )}
        </div>
      </label>

      {/* 책 상태 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">책 상태</span>
        <div className={'w-full flex flex-col gap-1'}>
          <select
            className="select select-bordered w-full"
            {...register('status', { required: true })}
          >
            <option value="NEW">새 책</option>
            <option value="LIKE_NEW">거의 새 책</option>
            <option value="GOOD">양호</option>
            <option value="ACCEPTABLE">사용감 있음</option>
          </select>
        </div>
      </label>

      {/* 설명 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">설명</span>
        <div className={'w-full flex flex-col gap-1'}>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register('description')}
          />
        </div>
      </label>

      {/* 이미지 업로드 */}
      <label className="form-control w-full md:flex md:flex-row md:items-center">
        <span className="label-text min-w-[120px]">책 이미지 업로드</span>
        <div className={'w-full flex flex-col gap-1'}>
          <input
            type="file"
            multiple
            className="file-input file-input-bordered w-full"
            onChange={handleImageUpload}
          />

          {/* 이미지 미리보기 */}
          {imageFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {imageFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-lg border p-1 flex items-center justify-center bg-gray-100 shadow-md"
                >
                  <Image
                    width={200}
                    height={200}
                    src={URL.createObjectURL(file)}
                    alt="책 이미지"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </label>

      {/* 제출 버튼 */}
      <button type="submit" className="btn btn-primary w-full text-lg">
        📌 등록하기
      </button>
    </form>
  );
}
