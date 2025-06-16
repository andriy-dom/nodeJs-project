    import db from '../db.js';
    import errorHandler from '../utils/errorHandler.js';
   
    const createProduct = async (req, res) => {
        const { name, type_product, price, colour, size = null, brand = null, description = null, quantity } = req.body;
        try {
            const [rows] = await db.query(`
                INSERT INTO products (name, type_product, price, colour, size, brand, description, quantity) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                [name, type_product, price, colour, size, brand, description, quantity]
            );
            res.status(201).json({
                message: `Product ${name} successfully added!`
            }) 
        } catch (err) {
            errorHandler(res, err);
        }
    }

    export {
        createProduct
    }