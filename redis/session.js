    //setting session
    import session from 'express-session';
    import {RedisStore} from 'connect-redis';
    import client from './redisClient.js';
    import keys from '../config/keys.js';

    const store = new RedisStore({
        client: client,
        prefix: 'sess:',
    });

    export default session({
        store,
        secret: keys.secret,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 30 }, // 30 хв
    });

    

    