    import db from '../db.js';
    import errorHandler from '../utils/errorHandler.js';

    const createOrder = async (req, res) => {
        const { user_id, product_id } = req.body;
        try {
            const [rows] = await db.query(`INSERT INTO orders (user_id, product_id, status) VALUES (?, ?, ?)`, [user_id, product_id, 'created'])
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