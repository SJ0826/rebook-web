import BookForm from '@/app/book/register/BookForm';

export default function BookRegisterPage() {
  return (
    <div className="container mx-auto max-w-2xl p-6 bg-base-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">📚 책 등록</h1>
      <BookForm />
    </div>
  );
}
