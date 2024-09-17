import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.log('Redis error:', err);
    });
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    await this.client.setEx(key, duration, value);
  }

  async del(key) {
    await this.client.del(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
