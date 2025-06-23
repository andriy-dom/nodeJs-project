    import db from '../db.js';
    import errorHandler from '../utils/errorHandler.js';

    const createOrder = async (req, res) => {
        const { user_id, product_id, quantity_product } = req.body;
        try {
            const [check] = await db.query(`SELECT quantity FROM products WHERE id = ?`, [product_id]);
            if(check[0].quantity < quantity_product) {
	            return res.json({ message: 'No such products'});
            } 

            const [rows] = await db.query(`INSERT INTO orders (user_id, product_id, status, quantity_product) VALUES (?, ?, ?, ?)`, [user_id, product_id, 'created', quantity_product]);

            await db.query(`UPDATE products SET quantity = quantity - ? WHERE id = ?`, [quantity_product, product_id]);
            res.status(201).json({
                message: 'Order succsessfully created!',
                order_id: rows.insertId
            })
        } catch (err) {
            errorHandler(res, err);
        }
    }

    const updateOrderStatus = async (req, res) => {
        const { orderId } = req.params;
        const baseUrl = 'http://localhost:3000'
        try {
            const [checkBlockUser] = await db.query(`SELECT users.is_blocked FROM users JOIN orders ON orders.user_id = users.id WHERE orders.id = ?`, [orderId]);
            
            if (checkBlockUser[0].is_blocked) {
                return res.status(403).json({ message: 'The author of this order is blocked' });
            }
            
            const [rows] = await db.query(`SELECT status FROM orders WHERE id = ?`, [orderId]);

            if(rows.length === 0) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }

            const currentStatus = rows[0].status;

            let nextStatus
            if(currentStatus === 'created') {
                nextStatus = 'in process'
            } else if(currentStatus === 'in process') {
                nextStatus = 'completed'
            } else if(currentStatus === 'completed') {
                return res.status(404).json({ message: 'Order is already completed!'})
            }

            await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [nextStatus, orderId]);
            res.status(201).json({
                message: `Order succsessfully updated to ${nextStatus}!`,
                update: nextStatus === 'completed' ? null : baseUrl + `/order/update/${orderId}`
            })
        } catch (err) {
            errorHandler(res, err);
        }
    }

    const getOrderStatus = async (req, res) => {
        const orderId = req.params.orderId
        try {
            const [rows] = await db.query(`SELECT status FROM orders WHERE id = ?`, [orderId]);
            res.status(200).json(rows);
        } catch (err) {
            errorHandler(res, err);
        }
    }

    export {
        createOrder,
        updateOrderStatus,
        getOrderStatus
    }