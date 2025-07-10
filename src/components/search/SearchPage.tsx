'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui';
import {
  clearRecentSearch,
  getRecentSearch,
  removeRecentSearch,
  setRecentSearch,
} from '@/lib/utils/recentSearch';
import { ROUTES } from '@/lib/constants';

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchParams?.q || '');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // 컴포넌트 마운트 시 최근 검색어 로드
  useEffect(() => {
    const searches = getRecentSearch() ?? [];
    setRecentSearches(searches);
  }, []);

  // 최근 검색어 새로고침 함수
  const refreshRecentSearches = () => {
    const searches = getRecentSearch();
    setRecentSearches(searches);
  };

  // 검색 실행
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // 최근 검색어에 추가 (중복 제거)
    setRecentSearch(trimmedQuery);
    refreshRecentSearches();

    // 홈페이지로 이동하면서 검색 실행
    router.push(ROUTES.HOME + `?search=${encodeURIComponent(trimmedQuery)}`);
  };

  // 개별 검색어 삭제
  const handleRemoveSearch = (query: string) => {
    removeRecentSearch(query);
    refreshRecentSearches();
  };

  // 전체 검색어 삭제
  const handleClearAll = () => {
    clearRecentSearch();
    setRecentSearches([]);
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 검색 헤더 */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="-ml-2 flex-shrink-0 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>

          {/* 검색 입력 */}
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="원하시는 책 이름을 검색해보세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              clearable={false}
              className={'rounded-full'}
            />

            {/* 클리어 버튼 */}
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute top-1/2 right-10 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}

            {/* 검색 버튼 */}
            <button
              onClick={() => handleSearch(searchValue)}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-blue-600"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 검색 내용 */}
      <div className="px-4 py-6">
        <>
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  최근 검색어
                </h2>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  전체 삭제
                </button>
              </div>

              <ul className="space-y-1">
                {recentSearches?.map((search, index) => (
                  <li
                    key={`${search}-${index}`}
                    className="group flex items-center justify-between rounded-lg px-2 py-3 hover:bg-gray-50"
                  >
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex-1 text-left text-gray-700"
                    >
                      <span className="text-base">{search}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveSearch(search)}
                      className="p-1 text-gray-400"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 인기 키워드 */}
          {/*<section>*/}
          {/*  <h2 className="mb-4 text-lg font-semibold text-gray-900">*/}
          {/*    인기 검색어*/}
          {/*  </h2>*/}
          {/*  <div className="grid grid-cols-2 gap-3">*/}
          {/*    {[*/}
          {/*      '프로그래밍',*/}
          {/*      '소설',*/}
          {/*      '자기계발',*/}
          {/*      '경제경영',*/}
          {/*      '요리',*/}
          {/*      '여행',*/}
          {/*      '건강',*/}
          {/*      '취미',*/}
          {/*    ].map((keyword, index) => (*/}
          {/*      <button*/}
          {/*        key={keyword}*/}
          {/*        onClick={() => handleSearch(keyword)}*/}
          {/*        className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"*/}
          {/*      >*/}
          {/*        <span className="font-medium text-gray-700">{keyword}</span>*/}
          {/*        <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-500">*/}
          {/*          {index + 1}*/}
          {/*        </span>*/}
          {/*      </button>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*</section>*/}

          {/* 검색어가 없을 때 안내 */}
          {recentSearches.length === 0 && (
            <div className="py-12 text-center">
              <MagnifyingGlassIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-500">
                검색어를 입력해보세요
              </h3>
              <p className="text-gray-400">원하시는 책을 찾아드리겠습니다</p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
