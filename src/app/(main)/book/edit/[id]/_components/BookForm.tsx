import Image from 'next/image';
import { useEditBookForm } from '@/app/(main)/book/edit/[id]/_hooks';
import { Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type BookFormProps = {
  id: number;
};

export const BookForm = ({ id }: BookFormProps) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    handleImageUpload,
    imageFiles,
    removeImage,
    isPending,
    resetForm,
  } = useEditBookForm(id);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
      {/*책 정보 등록*/}
      <div className={'flex flex-col gap-10'}>
        <div className={'border-b border-b-1 border-gray-200 pb-3'}>
          <h2 className={'text-lg font-semibold md:text-2xl'}>
            ✏️ 책의 정보를 입력해주세요
          </h2>
        </div>
        <div className={'flex flex-col gap-6 md:flex-row'}>
          {/* 제목 */}
          <label className="form-control w-full items-start">
            <span className="label-text min-w-[120px]">책 제목</span>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('title', { required: '책 제목을 입력하세요.' })}
            />
            {errors.title && (
              <span className="text-error">{errors.title.message}</span>
            )}
          </label>
          {/* 저자 */}
          <label className="form-control w-full">
            <span className="label-text min-w-[120px]">저자</span>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('author', { required: '저자를 입력하세요.' })}
            />
            {errors.author && (
              <span className="text-error">{errors.author.message}</span>
            )}
          </label>
        </div>
        <div className={'flex flex-col gap-6 md:flex-row'}>
          {/* 출판사 */}
          <label className="form-control w-full">
            <span className="label-text min-w-[120px]">출판사</span>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('publisher', { required: '출판사를 입력하세요.' })}
            />
            {errors.publisher && (
              <span className="text-error">{errors.publisher.message}</span>
            )}
          </label>
          {/* 가격 */}
          <label className="form-control w-full">
            <span className="label-text min-w-[120px]">가격 (₩)</span>
            <input
              type="number"
              className="input input-bordered w-full"
              {...register('price', {
                required: '가격을 입력하세요.',
                min: { value: 0, message: '가격은 0 이상이어야 합니다.' },
                valueAsNumber: true,
              })}
            />
            {errors.price && (
              <span className="text-error">{errors.price.message}</span>
            )}
          </label>
        </div>
        <div className={'flex flex-col gap-6 md:flex-row'}>
          {/* 책 상태 */}
          <label className="form-control w-full">
            <span className="label-text min-w-[120px]">책 상태</span>
            <Select
              {...register('status', { required: true })}
            >
              <Select.Button className="select select-bordered w-full flex items-center justify-between">
                <span>책 상태를 선택하세요</span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </Select.Button>
              <Select.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                <Select.Option value="NEW" className="cursor-pointer px-4 py-3 hover:bg-gray-100">
                  새 책
                </Select.Option>
                <Select.Option value="LIKE_NEW" className="cursor-pointer px-4 py-3 hover:bg-gray-100">
                  거의 새 책
                </Select.Option>
                <Select.Option value="GOOD" className="cursor-pointer px-4 py-3 hover:bg-gray-100">
                  양호
                </Select.Option>
                <Select.Option value="ACCEPTABLE" className="cursor-pointer px-4 py-3 hover:bg-gray-100">
                  사용감 있음
                </Select.Option>
              </Select.Options>
            </Select>
          </label>
          <div className="form-control w-full" />
        </div>
      </div>
      {/* 책 설명 등록 */}
      <div className={'flex flex-col gap-10'}>
        <div className={'border-b border-b-1 border-gray-200 pb-3'}>
          <h2 className={'text-lg font-semibold md:text-2xl'}>
            💬 책에 대해 설명해주세요.
          </h2>
        </div>
        <label className="form-control w-full">
          <div className={'flex w-full flex-col gap-1'}>
            <textarea
              className="textarea textarea-bordered min-h-[200px] w-full"
              placeholder={
                '설명을 자세하게 적을수록 거래 성공 확률이 높아져요\n' +
                '- 책은 어떤 이야기를 가지고 있나요?\n' +
                '- 책의 사용감은 어느정도 인가요?\n' +
                '- 거래 방식은 어떤 것을 선호하시나요? (택배/직거래 등) \n\n' +
                '중요! 신원이 노출될 수 있는 개인정보(ex. 핸드폰번호)는 작성하지마세요.'
              }
              {...register('description')}
            />
          </div>
        </label>
      </div>
      <div className={'flex flex-col gap-10'}>
        <div className={'border-b border-b-1 border-gray-200 pb-3'}>
          <h2 className={'text-lg font-semibold md:text-2xl'}>
            🤳 책의 사진을 올려주세요
          </h2>
        </div>
        {/* 이미지 업로드 */}
        <label className="w-full">
          <div className={'flex w-full flex-col gap-1'}>
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
                    className="relative flex h-24 w-24 items-center justify-center rounded-lg border bg-gray-100 p-1 shadow-md"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={file.imageUrl}
                      alt="책 이미지"
                      className="pointer-events-none h-full w-full rounded-md object-cover" // 👈 추가
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 rounded-full bg-red-500 px-1 py-0.5 text-xs text-white"
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
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <button
          type="button"
          className="btn btn-secondary w-1/2 text-lg"
          onClick={resetForm}
        >
          {'취소'}
        </button>
        <button
          type="submit"
          className="btn btn-primary w-1/2 text-lg"
          disabled={isPending}
        >
          {isPending ? '수정 중...' : '수정 완료'}
        </button>
      </div>
    </form>
  );
};
