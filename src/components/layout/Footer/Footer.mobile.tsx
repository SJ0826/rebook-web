import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpenIcon,
  ChatBubbleOvalLeftIcon,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  BookOpenIcon as BookOpenSolidIcon,
  ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftSolidIcon,
  HomeIcon as HomeSolidIcon,
  PlusIcon as PlusSolidIcon,
  UserIcon as UserSolidIcon,
} from '@heroicons/react/24/solid';
import { ROUTES } from '@/lib/constants';

const FooterMobile = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: '홈',
      href: ROUTES.HOME,
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
    },
    {
      name: '내서점',
      href: ROUTES.MY_BOOKSTORE,
      icon: BookOpenIcon,
      activeIcon: BookOpenSolidIcon,
    },
    {
      name: '판매하기',
      href: ROUTES.BOOK_REGISTER,
      icon: PlusIcon,
      activeIcon: PlusSolidIcon,
      isSpecial: true, // 특별한 스타일링
    },
    {
      name: '채팅',
      href: ROUTES.CHAT,
      icon: ChatBubbleOvalLeftIcon,
      activeIcon: ChatBubbleOvalLeftSolidIcon,
    },
    {
      name: '마이페이지',
      href: ROUTES.MY_BOOKSTORE,
      icon: UserIcon,
      activeIcon: UserSolidIcon,
    },
  ];

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);
          const IconComponent = isActive ? item.activeIcon : item.icon;

          if (item.isSpecial) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-1"
              >
                <div className="relative">
                  <div className="bg-secondary-600 rounded-full p-2 text-white shadow-lg">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {/* 판매하기 알림 점  */}
                  {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div> */}
                </div>
                <span className="text-secondary-600 mt-1 text-xs font-medium">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-2 transition-colors ${
                isActive
                  ? 'text-secondary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent
                className={`mb-1 h-6 w-6 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span
                className={`truncate text-xs font-medium transition-all ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item.name}
              </span>
              {/* 활성 상태 인디케이터 */}
              {isActive && (
                <div className="bg-secondary-600 mt-1 h-1 w-1 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* iPhone 홈 인디케이터 공간 */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </nav>
  );
};

export default FooterMobile;
