export enum MessageEnum {
  /**
   * Password
   */
  INVALID_PASSWORD = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  REQUIRED_PASSWORD = 'Password is required',
  NOT_EXIST_PASSWORD = 'Mật khẩu sai',

  /**
   * Username
   */
  REQUIRED_USERNAME = 'Username is required',
  INVALID_USERNAME = 'Username must be email format',
  NOT_EXIST_USERNAME = 'Tài khoản không tồn tại',

  /**
   * Id
   */
  INVALID_ID = 'Id must be string',
  REQUIRED_ID = 'Id is required',

  /**
   * Code
   */
  REQUIRED_CODE = 'Code is required',

  /**
   * Name
   */
  REQUIRED_NAME = 'Name is required',

  /**
   * String length
   */
  MIN_LENGTH_8 = 'Minimum character length must be at least 8 characters',
  MAX_LENGTH_25 = 'Maximum character length must be at least 25 characters',
  MAX_LENGTH_100 = 'Maximum character length must be at least 100 characters',

  USERNAME_EXISTED = 'Username has already been registered',

  LOGIN_SUCCESS = 'Đăng nhập thành công',

  ACTION_SUCCESS = 'Thao tác thành công'
}
