import { ArrayOrList } from '@luna/definitions';
import { List } from 'immutable';

export async function asyncForEach<T, K = any>(
  items: ArrayOrList<T>,
  callback: (item: T, index: number) => Promise<K>
) {
  for (let index = 0; index < List(items).size; index++) {
    const item = List(items).get(index);

    if (item) {
      await callback(item, index);
    }
  }
}
