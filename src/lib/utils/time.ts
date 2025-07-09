// 오전/오후 HH:MM
export const formatKoreanTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${period} ${hour12}:${paddedMinutes}`;
};

/**
 * 주어진 날짜로부터 현재까지의 시간 차이를 사용자 친화적인 형태로 반환
 * @param createdAt - ISO 형식의 날짜 문자열
 * @returns 시간 차이를 나타내는 문자열
 */
export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();

  // 밀리초를 각 단위로 변환
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // 1분 미만
  if (diffInMinutes < 1) {
    return '방금 전';
  }

  // 1시간 미만 - 분 단위
  if (diffInHours < 1) {
    return `${diffInMinutes}분 전`;
  }

  // 1일 미만 - 시간 단위
  if (diffInDays < 1) {
    return `${diffInHours}시간 전`;
  }

  // 1주일 미만 - 일 단위
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  // 1개월 미만 - 주 단위
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}주 전`;
  }

  // 1년 미만 - 개월 단위
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months}개월 전`;
  }

  // 1년 이상 - 년 단위
  const years = Math.floor(diffInDays / 365);
  return `${years}년 전`;
};
