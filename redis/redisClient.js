//connection redis
import redis from 'redis';
const client = redis.createClient();

client.connect()
  .then(() => console.log('Redis connected'))
  .catch(console.error);

export default client;
