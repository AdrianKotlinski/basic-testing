import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path', () => ({
  ...jest.requireActual<typeof import('path')>('path'),
  join: jest.fn((...args: string[]) =>
    jest.requireActual<typeof import('path')>('path').join(...args),
  ),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);
    expect(spy).toHaveBeenCalledWith(cb, 1000);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    doStuffByTimeout(cb, 1000);
    expect(cb).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setInterval');
    const cb = jest.fn();
    doStuffByInterval(cb, 500);
    expect(spy).toHaveBeenCalledWith(cb, 500);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    doStuffByInterval(cb, 500);
    jest.advanceTimersByTime(500 * 3);
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    await readFileAsynchronously('test.txt');
    expect(path.join).toHaveBeenCalledWith(expect.any(String), 'test.txt');
  });

  test('should return null if file does not exist', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously('missing.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fsPromises.readFile as jest.Mock).mockResolvedValue(Buffer.from('hello'));
    const result = await readFileAsynchronously('file.txt');
    expect(result).toBe('hello');
  });
});
