    import express from 'express';
    import authMiddleware from '../middleware/authMiddleware.js';
    import checkRole from '../middleware/checkAdminRole.js';
    import {
        createProduct
    } from '../controllers/product.js'

    const router = express.Router();

    //localhost:3000/product
    router.post('/',  authMiddleware, checkRole('admin'), createProduct)

    export default router; 