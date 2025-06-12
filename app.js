    import express from 'express';
    import authRoutes from './routes/auth.js';
    import categoryRoutes from './routes/category.js';
    import productRoutes from './routes/product.js';
    import orderRoutes from './routes/order.js';
    const app = express();
    
    // http://localhost:3000
    app.use('/auth', authRoutes);
    app.use('/category', categoryRoutes);
    app.use('/product', productRoutes);
    app.use('/order', orderRoutes);
    
    app.get('/', (req, res) => {
        res.send('shop_online API works')
    })

    export default app;