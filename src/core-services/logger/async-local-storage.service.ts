import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncLocalStorageService {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  run(store: Map<string, any>, callback: () => void) {
    this.storage.run(store, callback);
  }

  getStore(): Map<string, any> | undefined {
    return this.storage.getStore();
  }
}
