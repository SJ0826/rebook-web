const LocalStorageKey_Search = 'recentSearch'; // 로컬스토리지 저장 키
const MAX_RECENT_SEARCH = 10; // 최근 검색어 최대 저장 개수

/**
 * 최근 검색어 가져오기
 */
export function getRecentSearch() {
  return getLocalStorage(LocalStorageKey_Search)
    ? getLocalStorage(LocalStorageKey_Search)
    : [];
}

/**
 * 최근 검색어 저장하기
 */
export function setRecentSearch(query: string) {
  const recent = getRecentSearch() ?? [];

  // 중복 제거

  const filtered = recent.filter((q: string) => q !== query);

  // 맨 앞에 추가하고 최대 개수 제한
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCH);

  setLocalStorage(LocalStorageKey_Search, updated);
}

/**
 * 최근 검색어 개별 삭제
 */
export function removeRecentSearch(query: string) {
  const recent = getRecentSearch();
  const updated = recent.filter((q: string) => q !== query);
  setLocalStorage(LocalStorageKey_Search, updated);
}

/**
 * 최근 검색어 전체 삭제
 */
export function clearRecentSearch() {
  clearItemInLocalStorage(LocalStorageKey_Search);
}

export function getLocalStorage(key: string) {
  if (typeof document !== 'undefined') {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
}

export function setLocalStorage(key: string, value: unknown) {
  if (typeof document !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function clearItemInLocalStorage(key: string) {
  if (typeof document !== 'undefined') {
    localStorage.removeItem(key);
  }
}
