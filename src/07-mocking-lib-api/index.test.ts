import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    throttledGetDataFromApi.cancel();
  });

  test('should create instance with provided base url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: null });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    await throttledGetDataFromApi('/path');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: null });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    await throttledGetDataFromApi('/path');

    expect(mockGet).toHaveBeenCalledWith('/path');
  });

  test('should return response data', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: 'result' });
    (axios.create as jest.Mock).mockReturnValue({ get: mockGet });

    const result = await throttledGetDataFromApi('/path');

    expect(result).toBe('result');
  });
});
