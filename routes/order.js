    import express from 'express';
    import authMiddleware from '../middleware/authMiddleware.js';
    import checkRole from '../middleware/checkAdminRole.js';
    import {
        createOrder,
        updateOrderStatus,
        getOrderStatus
    } from '../controllers/order.js';


    const router = express.Router();

    // http://localhost:3000/order
    router.post('/', authMiddleware, createOrder);
    router.put('/update/:orderId', authMiddleware, checkRole('admin'), updateOrderStatus);
    router.get('/:orderId', authMiddleware, getOrderStatus);

    export default router;  