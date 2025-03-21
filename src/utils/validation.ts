// 이메일 형식 검사
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 강도 검사 (8자 이상, 영문+숫자+특수문자 포함)
export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 이미지 업로드 파일 확장자, 용량 검사
const MAX_FILE_SIZE = 7 * 1024 * 1024; // 7MB
const ALLOWED_TYPES = ['image/gif', 'image/jpeg', 'image/png'];

type ValidationResult = { valid: true } | { valid: false; message: string };

export function validateImages(files: File[]): ValidationResult {
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: `허용되지 않은 파일 형식입니다: ${file.name}`,
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `파일 크기가 7MB를 초과합니다: ${file.name}`,
      };
    }
  }

  return { valid: true };
}
