import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BookListSection from '@/app/(main)/my-bookstore/_components/BookListSection';
import { getFavoriteBooks } from '@/lib/api/my';
import { ROUTES } from '@/lib/constants';
import emptyImage from '@public/images/empty.png';

const FavoriteBooks = ({ isActive }: { isActive: boolean }) => {
  return (
    <BookListSection
      isActive={isActive}
      fetchBooks={getFavoriteBooks}
      queryKeyBase="favoriteBooks"
      EmptyState={EmptyFavoriteBooks}
    />
  );
};

export default FavoriteBooks;

const EmptyFavoriteBooks = ({ isShow }: { isShow: boolean }) => {
  const router = useRouter();
  if (!isShow) return null;
  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-4 py-20 text-center">
      <div className="relative h-40 w-40">
        <Image
          src={emptyImage}
          alt="ReBook Logo"
          fill
          sizes={'160px'}
          priority
          className="object-contain"
        />
      </div>
      <h2 className="text-2xl font-bold text-neutral-800">
        좋아요한 책이 없어요
      </h2>
      <p className="text-gray-500">
        마음에 드는 책을 추가해보세요. 나중에 쉽게 확인할 수 있어요!
      </p>
      <button
        onClick={() => router.push(ROUTES.HOME)}
        className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black shadow transition hover:bg-yellow-300"
      >
        책 보러가기
      </button>
    </div>
  );
};
