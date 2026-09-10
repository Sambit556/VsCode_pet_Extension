import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BackendServer } from '../src/backend/server';
import { PetManager } from '../src/pets/PetManager';
import { PetStorage } from '../src/storage/PetStorage';

class MockMemento {
  private store = new Map<string, any>();
  get<T>(key: string, defaultValue?: T): T {
    return this.store.has(key) ? this.store.get(key) : defaultValue;
  }
  async update(key: string, value: any): Promise<void> {
    if (value === undefined) this.store.delete(key);
    else this.store.set(key, value);
  }
}

describe('BackendServer & Express API', () => {
  const authToken = 'test_token_456';
  let port = 0;
  let baseUrl = '';

  beforeAll(async () => {
    PetManager.getInstance().initialize(new PetStorage(new MockMemento() as any));
    port = await BackendServer.getInstance().start(0, authToken);
    baseUrl = `http://127.0.0.1:${port}/api`;
  });

  afterAll(async () => {
    PetManager.getInstance().dispose();
    await BackendServer.getInstance().stop();
  });

  it('health check endpoint works', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.success).toBe(true);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await fetch(`${baseUrl}/pets`);
    expect(res.status).toBe(401);
  });

  it('fetches pets with valid auth token', async () => {
    const res = await fetch(`${baseUrl}/pets`, {
      headers: { 'x-pet-auth-token': authToken }
    });
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.pets)).toBe(true);
  });
});
