    import express from 'express';
    import authMiddleware from '../middleware/authMiddleware.js';
    import checkRole from '../middleware/checkAdminRole.js';
    import {
        createProduct,
        updateQuantity,
        addQuantity,
        cancellationQuantity
    } from '../controllers/product.js';

    const router = express.Router();

    //localhost:3000/product
    router.post('/',  authMiddleware, checkRole('admin'), createProduct);
    router.get('/update/:productId',  authMiddleware, checkRole('admin'), updateQuantity);
    router.put('/add-quantity/:productId',  authMiddleware, checkRole('admin'), addQuantity);
    router.put('/calcellation-quantity/:productId',  authMiddleware, checkRole('admin'), cancellationQuantity);

    export default router; 