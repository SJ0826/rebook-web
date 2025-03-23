// 파일: components/BookCard.tsx
import Image from 'next/image';

export const BookCard = () => {
  return (
    <div className="card shadow-md bg-base-100">
      <figure className="h-48">
        <Image
          src="/book-placeholder.jpg"
          alt="책 이미지"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">책 제목</h2>
        <p className="text-sm text-gray-500">저자 이름</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="font-semibold text-lg">₩ 9,000</span>
          <div className="badge badge-outline">좋아요</div>
        </div>
      </div>
    </div>
  );
};
