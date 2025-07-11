import Image from 'next/image';
import Link from 'next/link';
import { EnvelopeIcon, LinkIcon } from '@heroicons/react/20/solid';

const DesktopFooter = () => {
  return (
    <footer className="hidden border-t border-gray-200 bg-gray-50 lg:block">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* 메인 푸터 내용 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Rebook Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              중고책으로 새로운 가치를 만드는
              <br />
              리북에서 책의 두 번째 이야기를 시작하세요
            </p>
          </div>

          {/*  링크 정보 */}
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <span className={'text-gray-700'}>Contact</span>
            <Link
              href="https://github.com/SJ0826/rebook-web"
              className="flex items-center gap-2"
            >
              <LinkIcon width={16} height={16} />
              <span>️Github</span>
            </Link>
            <Link href="#" className="flex items-center gap-2">
              <EnvelopeIcon width={16} height={16} />
              <span>ikosdu60@gmail.com</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
