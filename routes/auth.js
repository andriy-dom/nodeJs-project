    import express from 'express';
    import { 
        login,
        register,
        block
    } from '../controllers/auth.js';
    import authMiddleware from '../middleware/authMiddleware.js';
    import checkRole from '../middleware/checkAdminRole.js';
    
    

    const router = express.Router();

    //localhost:3000/auth
    router.post('/login', login);
    router.post('/register', register);
    router.put('/admin/block-user/:id', authMiddleware, checkRole('admin'), block);

    export default router; 