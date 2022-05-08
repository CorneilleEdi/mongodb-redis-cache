import { RedisClient } from './redis.type';
import { Inject, Injectable } from '@nestjs/common';
import { RedisBaseModel } from './redis.model';
import { Helpers } from '../../utils/helpers';
import { REDIS_CLIENT } from '../../providers.constant';

@Injectable()
export class RedisRepository<T extends RedisBaseModel> {
  prefix = '';

  constructor(
    @Inject(REDIS_CLIENT)
    private redisClient: RedisClient,
  ) {}

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  async findAll() {
    const keys = await this.redisClient.keys(`${this.prefix}:*`);

    if (keys && !Helpers.isEmpty(keys)) {
      const ops = [];

      for (const key of keys) {
        ops.push(this.findByUid(key.split(`${this.prefix}:`)[1]));
      }
      const results = await Promise.all(ops);

      return results.filter((res) => res);
    } else {
      return [];
    }
  }

  async deleteAll() {
    const keys = await this.redisClient.keys(`${this.prefix}:*`);

    if (keys && !Helpers.isEmpty(keys)) {
      const ops = [];

      for (const key of keys) {
        ops.push(this.redisClient.del(key));
      }
      await Promise.all(ops);
    }
  }

  async findByUid(id: string) {
    if (!id) return null;
    return await this.get(id);
  }

  async add(element: T) {
    if (!element) return null;
    return await this.redisClient.set(`${this.prefix}:${element.id}`, JSON.stringify(element));
  }

  async addAll(elements: T[]) {
    if (!elements) return null;
    const data = [];

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      data.push(`${this.prefix}:${element.id}`);
      data.push(JSON.stringify(element));
    }

    return await this.redisClient.mset(data);
  }

  async get(id: string) {
    const data = await this.redisClient.get(`${this.prefix}:${id}`);

    if (data) {
      return JSON.parse(data) as T;
    } else {
      return null;
    }
  }

  async update(element: T) {
    if (!element) return null;
    return await this.redisClient.set(`${this.prefix}:${element.id}`, JSON.stringify(element));
  }

  async delete(id: string) {
    if (!id) return null;
    return await this.redisClient.del(`${this.prefix}:${id}`);
  }
}
