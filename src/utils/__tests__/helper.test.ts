import { getErrorMessage } from '../helper';

describe('getErrorMessage', () => {
  it('should return the message if error is an instance of Error', () => {
    const error = new Error('Something went wrong');
    const result = getErrorMessage(error);
    expect(result).toBe('Something went wrong');
  });

  it('should convert non-Error objects to string', () => {
    const result = getErrorMessage({ code: 500, msg: 'Internal Error' });
    expect(result).toBe('[object Object]');
  });

  it('should convert a string input to the same string', () => {
    const result = getErrorMessage('Custom error');
    expect(result).toBe('Custom error');
  });

  it('should convert null to "null"', () => {
    const result = getErrorMessage(null);
    expect(result).toBe('null');
  });

  it('should convert undefined to "undefined"', () => {
    const result = getErrorMessage(undefined);
    expect(result).toBe('undefined');
  });

  it('should convert a number to string', () => {
    const result = getErrorMessage(404);
    expect(result).toBe('404');
  });
});