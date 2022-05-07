import { RedisClient } from './redis.type';
import { Injectable } from '@nestjs/common';
import { RedisBaseModel } from './redis.model';
import { Helpers } from '../../utils/helpers';

@Injectable()
export class RedisRepository<T extends RedisBaseModel> {
  constructor(private redisClient: RedisClient, private prefix: string) {}

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

  async findByUid(uid: string) {
    if (!uid) return null;
    return await this.get(uid);
  }

  async add(element: T) {
    if (!element) return null;
    return await this.redisClient.set(`${this.prefix}:${element.uid}`, JSON.stringify(element));
  }

  async addAll(elements: T[]) {
    if (!elements) return null;
    const data = [];

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      data.push(`${this.prefix}:${element.uid}`);
      data.push(JSON.stringify(element));
    }

    return await this.redisClient.mset(data);
  }

  async get(uid: string) {
    const data = await this.redisClient.get(`${this.prefix}:${uid}`);

    if (data) {
      return JSON.parse(data) as T;
    } else {
      return null;
    }
  }

  async update(element: T) {
    if (!element) return null;
    return await this.redisClient.set(`${this.prefix}:${element.uid}`, JSON.stringify(element));
  }

  async delete(uid: string) {
    if (!uid) return null;
    return await this.redisClient.del(`${this.prefix}:${uid}`);
  }
}
