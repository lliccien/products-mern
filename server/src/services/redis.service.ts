import { createClient } from 'redis'
import { REDIS_PORT, REDIS_HOST } from '@config'

class RedisServise {
  private redisUrl: string = `redis://@${REDIS_HOST}:${REDIS_PORT}`
  private client: any

  constructor() {
    this.client = createClient()
  }

  public async set({ key, value }) {
    await this.client.connect()
    await this.client.set(key, value)
    await this.client.disconnect()
  }

  public async get(key: string) {
    await this.client.connect()
    const result = await this.client.get(key)
    await this.client.disconnect()
    return result
  }

  public async del(key: string) {
    await this.client.connect()
    await this.client.del(key)
    await this.client.disconnect()
  }
}

export default RedisServise
