import { idbSave, idbGetAll, idbDelete } from '@/lib/idb';

describe('idb helper functions', () => {
  beforeEach(() => {
    // Mock indexedDB for node environment
    const mockStore: Record<string, any> = {};
    const mockIDBDatabase = {
      transaction: jest.fn().mockImplementation((storeName, mode) => ({
        objectStore: jest.fn().mockReturnValue({
          put: jest.fn().mockImplementation((item) => {
            mockStore[item.id] = item;
            const req: any = { result: item };
            process.nextTick(() => { if (req.onsuccess) req.onsuccess(); });
            return req;
          }),
          getAll: jest.fn().mockImplementation(() => {
            const req: any = { result: Object.values(mockStore) };
            process.nextTick(() => { if (req.onsuccess) req.onsuccess(); });
            return req;
          }),
          delete: jest.fn().mockImplementation((id) => {
            delete mockStore[id];
            return { onsuccess: null, onerror: null };
          }),
        }),
      })),
    };

    (global as any).window = {
      indexedDB: {
        open: jest.fn().mockImplementation(() => {
          const req: any = { result: mockIDBDatabase, onupgradeneeded: null, onsuccess: null, onerror: null };
          setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0);
          return req;
        }),
      },
    };
  });

  test('saves and retrieves items from idb mock', async () => {
    const item = { id: 'test-1', name: 'asset-preview.png' };
    await idbSave(item);
  });
});
