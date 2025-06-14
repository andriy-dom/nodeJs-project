    import express from 'express';
    import {
        createOrder,
        updateOrderStatus,
        getOrderStatus
    } from '../controllers/order.js';
    import authMiddleware from '../middleware/authMiddleware.js';


    const router = express.Router();

    // http://localhost:3000/order
    router.post('/', authMiddleware, createOrder);
    router.put('/update/:orderId', updateOrderStatus);
    router.get('/:orderId', getOrderStatus);

    export default router; 