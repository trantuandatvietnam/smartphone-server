const Product = require('../models/ProductModel');

// Filter, sorting and pagination
class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObject = { ...this.queryString }; //queryString = req.query (params `pass` to the ApiFeature)
        const excludedFields = ['page', 'limit', 'sort'];
        excludedFields.map((field) => delete queryObject[field]);

        let queryObjectString = JSON.stringify(queryObject);
        queryObjectString = queryObjectString.replace(
            /**
             * gte: greater than equal
             * gt: greater than
             * lt: lesser than
             * lte: lesser than equal
             * regex:
             */
            /\b(gte|gt|lt|lte|regex)\b/g,
            (match) => '$' + match
        );
        this.query.find(JSON.parse(queryObjectString));
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const ProductController = {
    /**
     * public
     * [GET], 'api/products'
     */
    getProducts: async (req, res) => {
        try {
            // http://localhost:5000/api/products?category=animal&cost=5000 => req.query: { category: 'animal', cost: '5000' }
            const features = new ApiFeatures(Product.find(), req.query);
            // query data
            features.filtering().sorting().paginating();

            const products = await features.query;

            res.json({
                status: 'success',
                result: products.length,
                products: products,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * public
     * [GET], 'api/products'
     */
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if (!product) {
                return res.status(400).json({ message: 'S???n ph???m kh??ng t???n t???i' });
            }
            return res.json({ product });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * private
     * [POST], 'api/products'
     */
    createProduct: async (req, res) => {
        try {
            const { productName, sale, brand, price, category, productDescription, thumbnail, images, quantity } =
                req.body;
            // condition create product
            const productNameExist = await Product.findOne({ productName });
            if (productNameExist) {
                return res.status(400).json({ message: 'S???n ph???m ???? t???n t???i!' });
            }
            if (!thumbnail) {
                return res.status(400).json({
                    message: 'B???n ch??a t???i l??n h??nh ???nh n??o!',
                });
            }
            if (!quantity) {
                return res.status(400).json({
                    message: 'B???n ch??a nh???p s??? l?????ng h??ng c?? s???n!',
                });
            }
            if (!category) {
                return res.status(400).json({
                    message: 'C???n ph??n lo???i s???n ph???m!',
                });
            }
            if (!productName) {
                return res.status(400).json({
                    message: 'B???n ch??a ?????t t??n cho s???n ph???m!',
                });
            }
            if (!price) {
                return res.status(400).json({
                    message: 'Vui l??ng ??i???n gi?? cho s???n ph???m c???a b???n!',
                });
            }

            const newProduct = new Product({
                productName: productName.toLowerCase(),
                price,
                category,
                productDescription,
                thumbnail,
                images,
                quantity,
                brand,
                sale,
            });
            await newProduct.save();
            return res.json({ message: 'T???o s???n ph???m th??nh c??ng,Vui l??ng ?????n trang s???n ph???m ????? xem' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * private
     * [POST], 'api/products/:id'
     */
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { productName, price, category, productDescription, thumbnail, images, quantity, brand, sale, sold } =
                req.body;

            //condition update product
            if (images.length === 0) {
                res.status(400).json({
                    message: 'Ch??a t???i h??nh ???nh l??n!',
                });
            }

            const contentUpdate = {
                productName,
                price,
                category,
                productDescription,
                thumbnail,
                images,
                quantity,
                brand,
                sale,
                sold,
            };
            await Product.findOneAndUpdate({ _id: id }, contentUpdate);
            return res.json({ message: 'C???p nh???t s???n ph???m th??nh c??ng!' });
        } catch (error) {
            res.status(500).json({ message: 'C?? l???i x???y ra, th??? l???i sau!' });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'Kh??ng t??m th???y s???n ph???m' });
            }
            await Product.findByIdAndDelete(id);
            res.json({ message: '???? x??a s???n ph???m th??nh c??ng!' });
        } catch (error) {
            return res.status(500).json({ message: 'C?? l???i x???y ra, th??? l???i sau!' });
        }
    },
};

module.exports = ProductController;
