declare module "@cubejs-backend/redis-driver" {
  interface RedisOptions { 
  }

  export default class RedisDriver {
    constructor(options?: RedisOptions);
  }
}
