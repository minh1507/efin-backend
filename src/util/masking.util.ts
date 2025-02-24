export default class MaskingHelper {
  static password = (password: string): string => {
    return '***' + password.slice(-3);
  };
}
