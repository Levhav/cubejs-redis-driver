const redis = require('redis');
const BaseDriver = require('@cubejs-backend/query-orchestrator/driver/BaseDriver');
const { RedisSQL } = require('redis-sql'); 

class RedisDriver extends BaseDriver {

  constructor(config) {
    super();
    this.config = { 
      ...config
    };
     
    this.config.conn = redis.createClient();
  }

  async testConnection() {
    return this.config.conn.connected;
  }

  query(query, values) {  
   
    const parser = new RedisSQL()
    const luaQuery = parser.parse(query, values)

    console.log("\n--n", luaQuery);

    return new Promise(
      (resolve, reject) => {
        this.config.conn.eval(luaQuery, 0, function(err, res) {
          if(err){
            console.error("redis lua error", err, res);
            reject(err)
          }else{ 
            res = JSON.parse(res) 
            if(!Array.isArray(res))
            {
              res = []
            }
            
            console.log("redis answer", res);
            resolve(res)
          }
        }) 
    }) 
  }

  async release() {
    await new Promise((resolve, reject) => this.config.conn.quit((err) => (err ? reject(err) : resolve())));
  }
 
  async tablesSchema() { 
    return []
  }
 
  async getTablesQuery(schemaName) { 
    return [];  
  }
}

module.exports = RedisDriver;