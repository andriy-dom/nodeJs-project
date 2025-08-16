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

        const updateQuantity = async (req, res) => {
            const id = req.params.productId;
            const baseUrl = 'http://localhost:3000'
            try {
                res.status(200).json({
                    addQuantity: baseUrl + `/product/add-quantity/${id}`,
                    cancellationQuantity: baseUrl + `/product/calcellation-quantity/${id}`
                }) 
            } catch (err) {
                errorHandler(res, err);
            }
        }

        const addQuantity = async (req, res) => {
            const id = req.params.productId;
            const quantity = req.body.quantity
            try {
                await db.query(`UPDATE products SET quantity = quantity + ? WHERE id = ?`, [quantity, id]);
                const [rows] = await db.query(`SELECT quantity FROM products WHERE id = ?`, [id]);
                res.status(200).json({
                    message: `Added ${quantity} quantity product(-s)`,
                    current_quantity: rows[0].quantity
                }) 
            } catch (err) {
                errorHandler(res, err);
            }
        }

        const cancellationQuantity = async (req, res) => {
            const id = req.params.productId;
            try {
                await db.query(`UPDATE products SET quantity = 0 WHERE id = ?`, [id]);
                res.status(200).json({
                    message: `quantity product successfully cancelled`,
                }) 
            } catch (err) {
                errorHandler(res, err);
            }
        }

    export {
        createProduct,
        updateQuantity,
        addQuantity,
        cancellationQuantity
    }
