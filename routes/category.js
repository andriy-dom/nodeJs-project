    import express from 'express';
    import authMiddleware from '../middleware/authMiddleware.js';
    import checkRole from '../middleware/checkAdminRole.js';
    import {
        createCategory,
        getAllCategories,
        getCategoryItemsById,
        updateQuantity
    } from '../controllers/category.js';

    const router = express.Router();

     // http://localhost:3000/category
    router.post('/', authMiddleware, checkRole('admin'), createCategory);
    router.get('/', authMiddleware, getAllCategories);
    router.get('/products/:categoryId', authMiddleware, getCategoryItemsById);
    router.put('/product/update/:productId', authMiddleware, checkRole('admin'),  updateQuantity);

    export default router; 