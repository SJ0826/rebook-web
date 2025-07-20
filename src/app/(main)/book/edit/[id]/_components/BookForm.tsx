import Image from 'next/image';
import { useEditBookForm } from '@/app/(main)/book/edit/[id]/_hooks';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Button, Input } from '@/components/ui';
import { Controller } from 'react-hook-form';
import CustomListbox from '@/components/ui/CustomListbox';

type BookFormProps = {
  id: number;
};

export const BookForm = ({ id }: BookFormProps) => {
  const {
    control,
    watch,
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

  const bookStatusOptions = [
    { value: 'NEW', label: '새 책' },
    { value: 'LIKE_NEW', label: '거의 새 책' },
    { value: 'GOOD', label: '양호' },
    { value: 'ACCEPTABLE', label: '사용감 있음' },
  ];

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 sm:space-y-12"
      >
        {/*책 정보 등록*/}
        <section className="space-y-6 sm:space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              ✏️ 책의 정보를 입력해주세요
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* 📝 책 제목 */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  책 제목
                </span>
                <Input
                  type="text"
                  value={watch('title')}
                  placeholder="책 제목을 입력하세요"
                  {...register('title', { required: '책 제목을 입력하세요.' })}
                />
                {errors.title && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.title.message}
                  </span>
                )}
              </label>
            </div>

            {/* 📝 가격 */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  가격 (₩)
                </span>
                <Input
                  type="number"
                  value={watch('price')}
                  placeholder="가격을 입력하세요"
                  {...register('price', {
                    required: '가격을 입력하세요.',
                    min: { value: 0, message: '가격은 0 이상이어야 합니다.' },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.price.message}
                  </span>
                )}
              </label>
            </div>

            {/* 📝 출판사 */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  출판사
                </span>
                <Input
                  type="text"
                  value={watch('publisher')}
                  placeholder="출판사를 입력하세요"
                  {...register('publisher', {
                    required: '출판사를 입력하세요.',
                  })}
                />
                {errors.publisher && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.publisher.message}
                  </span>
                )}
              </label>
            </div>

            {/* 📝 저자 */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  저자
                </span>
                <Input
                  type="text"
                  value={watch('author')}
                  placeholder="저자를 입력하세요"
                  {...register('author', { required: '저자를 입력하세요.' })}
                />
                {errors.author && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors.author.message}
                  </span>
                )}
              </label>
            </div>

            {/* 📝 책 상태 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                책 상태
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: '책 상태를 선택해주세요' }}
                render={({ field }) => (
                  <CustomListbox
                    value={field.value || 'NEW'}
                    onChange={field.onChange}
                    options={bookStatusOptions}
                    placeholder="책 상태를 선택해주세요"
                    error={!!errors.status}
                  />
                )}
              />
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 📝 책 설명 */}
        <section className="space-y-6 sm:space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              💬 책에 대해 설명해주세요
            </h2>
          </div>

          <div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                책 설명
              </span>
              <textarea
                className="focus:ring-opacity-20 focus:border-secondary-500 focus:ring-secondary-500 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:ring-2 focus:outline-none"
                rows={8}
                placeholder={
                  '설명을 자세하게 적을수록 거래 성공 확률이 높아져요. \n- 책은 어떤 이야기를 가지고 있나요? \n - 책의 사용감은 어느정도 인가요? \n - 거래 방식은 어떤 것을 선호하시나요? (택배/직거래 등) \n\n 중요! 신원이 노출될 수 있는 개인정보(ex. 핸드폰번호)는 작성하지마세요.'
                }
                {...register('description')}
              />
            </label>
          </div>
        </section>

        {/* 이미지 업로드 */}
        <section className="space-y-6 sm:space-y-8">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              🤳 책의 사진을 올려주세요
            </h2>
          </div>

          <div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                이미지 업로드
              </span>
              <input
                type="file"
                multiple
                className="block w-full cursor-pointer rounded-lg border border-gray-300 text-gray-900 transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleImageUpload}
              />
            </label>

            {/* 이미지 미리보기 */}
            {imageFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium text-gray-700">
                  업로드된 이미지
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-colors hover:border-gray-300"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={file.imageUrl}
                        alt="책 이미지"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white opacity-90 transition-colors hover:bg-red-600 hover:opacity-100"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 제출 버튼 */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
          <Button
            type="button"
            onClick={resetForm}
            variant={'line-sub'}
            color={'gray'}
            className={'flex-1'}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className={'flex flex-1 items-center gap-2'}
            // className="focus:ring-opacity-20 flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <PencilIcon width={16} height={16} />
            {isPending ? '등록중...' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};
