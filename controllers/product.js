    import db from '../db.js';
    import errorHandler from '../utils/errorHandler.js';
   
    const createProduct = async (req, res) => {
        const { name, type_product, price, colour } = req.body;
        try {
            const [rows] = await db.query(`
                INSERT INTO products (name, type_product, price, colour) 
                VALUES (?, ?, ?, ?)`, 
                [name, type_product, price, colour]
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