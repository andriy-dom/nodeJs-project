    import db from '../db.js';
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import keys from '../config/keys.js';
    import client from '../redis/redisClient.js';
    import errorHandler from '../utils/errorHandler.js';

    const login = async (req, res) => {
        const { email, password } = req.body;
        //перевіряємо чи існує юзер в базі даних за таким email, якщо + отримаєм id, пароль
        const [resultCheckUser] = await db.query(`SELECT id, password, is_blocked FROM users WHERE email = ?`, [email])

        if (resultCheckUser.length > 0) {
            //перевірка паролю, користувач існує
            const passwordResult = bcrypt.compareSync(password, resultCheckUser[0].password);
            
            if (passwordResult) {
                //паролі співпали
                if(resultCheckUser[0].is_blocked){
                    return res.status(403).json({ message: 'Your account is blocked' });
                }

                const { id, is_blocked } = resultCheckUser[0];
                req.session.user = {
                    id,
                    is_blocked,
                    email
                }
                const sessionId = req.sessionID//унікальний id сесії
                await client.SADD(`user_session:${id}`, sessionId)

                //генеруєм токен
                const token = jwt.sign({
                    email: email,
                    userId: resultCheckUser[0].id
                }, keys.jwt, {expiresIn: 60 * 60});
                res.status(200).json({
                    token: `Bearer ${token}`
                })
            } else {
                //паролі не співпали
                res.status(401).json({
                    message: 'Passwords do not match, try again'
                })
            }
        } else {
            //такого email не знайдено
            res.status(404).json({
                message: 'No user with this email was found'
            });
        };
    };

    const register = async (req, res) => {
        //email password
        const { name, surname, birth_date, email, password, role } = req.body;
        const [resultEmail] = await db.query(`SELECT id FROM users WHERE email = ?`, [email])

        if (resultEmail.length > 0) {
            //користувач вже існує, потрібно відправити помилку
            res.status(409).json({
                message: 'This email is busy, try another one'
            })
        } else {
            //потрібно створити користувача
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            try {
                const [user] = await db.query(`INSERT INTO users (name, surname, birth_date, email, password, role) 
                    VALUES (?, ?, ?, ?, ?, ?)`, 
                    [name, surname, birth_date, email, hashPassword, role]);
                
                res.status(201).json({
                    message: 'User succsessfully created!',
                    userId: user.insertId
                });
    
            } catch (err) {
                errorHandler(res, err);
            }
        }
    }

    const block = async (req, res) => {
        const id = req.params.id
        try {
            await db.query(`UPDATE users SET is_blocked = true WHERE id = ?`, [id]);

            //Отримуємо всі сесії користувача
            const sessionIds = await client.SMEMBERS(`user_session:${id}`);

            
        for (const sid of sessionIds) {
            await client.DEL(`sess:${sid}`); // Видаляємо сесію вручну
        }

        await client.DEL(`user_session:${id}`);
  
        res.status(200).json({ message: 'User has been blocked' });
        } catch (err) {
            errorHandler(res, err);
        }
    }

    export {
        login,
        register,
        block
    }