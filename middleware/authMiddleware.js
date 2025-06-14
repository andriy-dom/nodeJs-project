    //кастомногий middleware, який перевіряє JWT токен, використовуючи лише "jsonwebtoken"
    import jwt from 'jsonwebtoken';
    import keys from '../config/keys.js';
    import db from '../db.js';
    
    export default async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if(!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ massage: 'Unauthorized: No token provided'});
            }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, keys.jwt);

        const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [decoded.userId])

        if(rows.length === 0) {
            return res.status(401).json({ message: 'User not found'})
        }

        req.user = rows[0];
        next()
        } catch (error) {
            console.log('JWT auth Error:', error.massage);
            return res.status(401).json({ message: 'Unauthorized: Invalid token'})
        }
    }