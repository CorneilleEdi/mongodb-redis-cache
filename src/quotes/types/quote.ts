import { RedisBaseModel } from '../../shared/libs/redis';

export class Quote extends RedisBaseModel {
  id: string;
  content: string;
  author: string;
}
