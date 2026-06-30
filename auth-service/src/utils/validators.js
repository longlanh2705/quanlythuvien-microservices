/**
 * Tập trung toàn bộ logic kiểm tra đầu vào cho auth-service.
 * Mọi ràng buộc dữ liệu đều được định nghĩa ở đây.
 */

// ── Hằng số giới hạn ──────────────────────────────────────────────────────────
export const RULES = {
  username: {
    minLength: 3,
    maxLength: 30,
    // Chỉ cho phép: chữ cái, số, dấu gạch dưới, dấu gạch ngang
    pattern: /^[a-zA-Z0-9_-]+$/,
    patternMsg: 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu _ hoặc -',
  },
  password: {
    minLength: 6,
    maxLength: 128,
  },
  fullName: {
    minLength: 2,
    maxLength: 100,
    // Phải chứa ít nhất một chữ cái thật (không phải toàn khoảng trắng / ký tự đặc biệt)
    pattern: /^[\p{L}\s'-]+$/u,
    patternMsg: 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch nối hoặc dấu nháy đơn',
  },
};

// ── Hàm tiện ích ──────────────────────────────────────────────────────────────

/**
 * Kiểm tra username
 * @returns {string|null} thông báo lỗi, hoặc null nếu hợp lệ
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') return 'Tên đăng nhập không được để trống.';
  const v = username.trim();
  if (v.length < RULES.username.minLength) return `Tên đăng nhập phải có ít nhất ${RULES.username.minLength} ký tự.`;
  if (v.length > RULES.username.maxLength) return `Tên đăng nhập không được vượt quá ${RULES.username.maxLength} ký tự.`;
  if (!RULES.username.pattern.test(v)) return RULES.username.patternMsg;
  return null;
};

/**
 * Kiểm tra password
 * @returns {string|null}
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return 'Mật khẩu không được để trống.';
  if (password.length < RULES.password.minLength) return `Mật khẩu phải có ít nhất ${RULES.password.minLength} ký tự.`;
  if (password.length > RULES.password.maxLength) return `Mật khẩu không được vượt quá ${RULES.password.maxLength} ký tự.`;
  return null;
};

/**
 * Kiểm tra họ tên
 * @returns {string|null}
 */
export const validateFullName = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return 'Họ tên không được để trống.';
  const v = fullName.trim();
  if (v.length < RULES.fullName.minLength) return `Họ tên phải có ít nhất ${RULES.fullName.minLength} ký tự.`;
  if (v.length > RULES.fullName.maxLength) return `Họ tên không được vượt quá ${RULES.fullName.maxLength} ký tự.`;
  if (!RULES.fullName.pattern.test(v)) return RULES.fullName.patternMsg;
  return null;
};
