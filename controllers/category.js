    import db from '../db.js';
    import errorHandler from '../utils/errorHandler.js';

    const createCategory = async (req, res) => {
        const { name } = req.body;
        try {
            const [rows] = await db.query(`INSERT INTO type_products (name) VALUES (?)`, [name]);
            res.status(201).json({
                message: `Category ${name} succsessfully added!`
            })
        } catch (err) {
            errorHandler(res, err);
        }
    }

    const getAllCategories = async (req, res) => {
        const baseUrl = 'http://localhost:3000'
        try {
            const [categoriesFromDb] = await db.query(`SELECT id, name FROM type_products`);
            res.status(200).send(categoriesFromDb.map(category => ({id: category.id, name: category.name, url: baseUrl + `/category/products/${category.id}`})))
        } catch (err) {
            errorHandler(res, err);
        }
    }

    // http://localhost:3000/category/products/:categoryId
    const getCategoryItemsById = async (req, res) => {
        const id  = req.params.categoryId;
        const baseUrl = 'http://localhost:3000/category';
        try {
            const [rows] = await db.query(`SELECT * FROM products WHERE type_product = ?`, [id]);
            if(rows.length === 0) {
                res.json({
                    message: 'No products found in this category'
                })
            }
            res.status(200).json(rows.map(product => ({product, update: baseUrl + `/product/update/${product.id}`})))
        } catch (err) {
            errorHandler(res, err);
        }
    }

    // http://localhost:3000/category/product/update/:productId
    const updateQuantity = async (req, res) => {
        const id = req.params.productId;
        const quantity = req.body.quantity;
        try {
            await db.query(`UPDATE products SET quantity = ? WHERE id = ?`, [quantity, id]);
            res.status(201).json({
                message: `Product successfully updated!` //можна ще подумати щоб повертати кількість товару після оновлення
            }) 
        } catch (err) {
            errorHandler(res, err);
        }
    }

    export {
        createCategory,
        getAllCategories,
        getCategoryItemsById,
        updateQuantity
    }

    //  products: rows,
    //  update: baseUrl + `/product/update/${rows[0].id}`