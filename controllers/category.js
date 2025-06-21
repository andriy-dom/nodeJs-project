    import db from '../db.js';
    import client from '../redisClient.js';
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
        const baseUrl = 'http://localhost:3000';
        const cacheKey = 'all:categories';
        try {
            const cached = await client.get(cacheKey);
            if(cached) {
                return res.status(200).send(JSON.parse(cached));
            }

            const [categoriesFromDb] = await db.query(`SELECT id, name FROM type_products`);
            
            const result = categoriesFromDb.map(category => ({id: category.id, name: category.name, url: baseUrl + `/category/products/${category.id}`}))
            await client.setEx(cacheKey, 3600, JSON.stringify(result));
            res.status(200).send(result)
        } catch (err) {
            errorHandler(res, err);
        }
    }

    const getCategoryItemsById = async (req, res) => {
        const id  = req.params.categoryId;
        const baseUrl = 'http://localhost:3000';
        const cacheKey = 'all:items:category';
        try {
            const cached = await client.get(cacheKey);
            if(cached) {
                return res.status(200).send(JSON.parse(cached));
            }

            const [rows] = await db.query(`SELECT * FROM products WHERE type_product = ?`, [id]);
            if(rows.length === 0) {
                res.json({
                    message: 'No products found in this category'
                })
            }

            const result = rows.map(product => ({product, update: baseUrl + `/product/update/${product.id}`}));
            await client.setEx(cacheKey, 3600, JSON.stringify(result));
            
            res.status(200).json(result);
        } catch (err) {
            errorHandler(res, err);
        }
    }



    export {
        createCategory,
        getAllCategories,
        getCategoryItemsById
    }

