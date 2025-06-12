    import express from 'express';
    import {
        createCategory,
        getAllCategories,
        getCategoryItemsById
    } from '../controllers/category.js';

    const router = express.Router();

     // http://localhost:3000/category
    router.post('/', createCategory);
    router.get('/', getAllCategories);
    router.get('/:categoryId', getCategoryItemsById);

    export default router; 