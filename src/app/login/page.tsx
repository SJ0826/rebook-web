export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <form className="flex flex-col gap-4 mt-4">
          <label className="form-control w-full">
            <span className="label-text">아이디</span>
            <input
              type="text"
              placeholder="아이디 입력"
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호 입력"
              className="input input-bordered w-full"
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            로그인
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-primary font-semibold">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
