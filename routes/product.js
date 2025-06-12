    import express from 'express';
    import {
        createProduct
    } from '../controllers/product.js'

    const router = express.Router();

    //localhost:3000/product
    router.post('/', createProduct)

    export default router; 