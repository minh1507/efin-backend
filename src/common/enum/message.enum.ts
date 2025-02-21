export enum MessageEnum {
  /**
   * Password
   */
  INVALID_PASSWORD = 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  REQUIRED_PASSWORD = 'Password is required',

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
}
