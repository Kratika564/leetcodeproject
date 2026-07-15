const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'floral-neosoft-ultracrisp-66758.db.redis.io',
        port: 19936
    }
});
module.exports = redisClient;



