import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(100).getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const acc = getBankAccount(50);
    expect(() => acc.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const acc = getBankAccount(50);
    const other = getBankAccount(0);
    expect(() => acc.transfer(200, other)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const acc = getBankAccount(100);
    expect(() => acc.transfer(10, acc)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const acc = getBankAccount(100);
    acc.deposit(50);
    expect(acc.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const acc = getBankAccount(100);
    acc.withdraw(30);
    expect(acc.getBalance()).toBe(70);
  });

  test('should transfer money', () => {
    const sender = getBankAccount(100);
    const receiver = getBankAccount(50);
    sender.transfer(40, receiver);
    expect(sender.getBalance()).toBe(60);
    expect(receiver.getBalance()).toBe(90);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const acc = getBankAccount(100);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValueOnce(50);
    const result = await acc.fetchBalance();
    expect(result).toEqual(expect.any(Number));
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const acc = getBankAccount(100);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValueOnce(50);
    await acc.synchronizeBalance();
    expect(acc.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const acc = getBankAccount(100);
    jest.spyOn(acc, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(acc.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
