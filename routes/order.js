    import express from 'express';
    import {
        createOrder,
        getOrderStatus
    } from '../controllers/order.js';

    const router = express.Router();

    // http://localhost:3000/order
    router.post('/', createOrder);
    router.get('/', getOrderStatus);

    export default router; 