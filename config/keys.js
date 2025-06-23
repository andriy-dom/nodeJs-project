import 'dotenv/config';

export default {
    password: process.env.PASSWORD_DB,
    jwt: process.env.JWT_SECRET,
    secret: process.env.SESS_SECRET
}