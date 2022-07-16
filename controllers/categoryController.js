const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');

const categoryController = {
    /**
     * Public
     * [GET](/api/category)
     */
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find();
            return res.json({ categories });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [Private] (only admin is created)
     * [POST](/api/category)
     */
    createCategory: async (req, res) => {
        try {
            const { name, pathname, icon, brand, img } = req.body;
            const existCategory = await Category.findOne({ name, pathname });
            if (existCategory) {
                return res.status(400).json({ message: 'Mặt hàng này đã tồn tại!' });
            }
            if (!img) {
                return res.status(400).json({ message: 'Vui lòng chọn một ảnh!' });
            }
            if (!icon) {
                return res.status(400).json({ message: 'Vui lòng chọn một icon!' });
            }
            const newCategory = new Category({ name, pathname: pathname.toLowerCase(), icon, brand, img });
            await newCategory.save();
            return res.json({ message: 'Tạo thành công, mặt hàng đã được thêm' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [Private] (only admin is updated)
     * [PATCH](/api/category/:id)
     */
    updateCategory: async (req, res) => {
        try {
            const { ...fieldUpdate } = req.body;
            const category = await Category.findByIdAndUpdate(req.params.id, { ...fieldUpdate });
            if (!category) {
                return res.status(400).json({ message: 'Không tìm thấy sản phầm!' });
            }
            return res.json({ message: 'Cập nhật mặt hàng thành công!', category });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * [Private] (only admin is deleted)
     * [DELETED](/api/category/:id)
     */
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            const products = await Product.find();
            const isExist = products.find((pro) => pro.category === category?.pathname);
            if (isExist) {
                return res.status(400).json({ message: 'Vui lòng xóa tất cả sản phẩm thuộc danh mục này!' });
            }
            await Category.findByIdAndDelete(id);
            return res.json({ message: 'Xóa thành công!' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = categoryController;
