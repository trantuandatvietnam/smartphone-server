const Notify = require('../models/NotifyModel');
const notifyController = {
    /**
     * api/getNotify
     * [GET], public
     */
    getNotify: async (req, res) => {
        try {
            const notifies = await Notify.find({});
            return res.json({ notifies });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/createNotify
     * [POST], private (auth/authAdmin)
     */
    createNotify: async (req, res) => {
        try {
            const { content, name } = req.body;
            const existNotify = await Notify.findOne({ content, name });
            if (existNotify) {
                return res.status(400).json({ message: 'Nội dung thông báo này đã được tạo!' });
            }
            const newContentNotify = new Notify({ content, name });
            await newContentNotify.save();
            return res.json({ message: 'Tạo thông báo thành công!' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/updateNotify
     * [PATCH], private (auth/authAdmin)
     */
    updateNotify: async (req, res) => {
        try {
            const { content } = req.body;
            const contentNotifyUpdate = await findOneAndUpdate({ _id: req.params.id }, content);
            if (!contentNotifyUpdate) {
                return res.status(400).json({ message: 'Không tìm thấy sản phẩm!' });
            }
            return res.json({ message: 'Cập nhật thành công nội dung thông báo!' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    /**
     * api/deleteNotify
     * [DELETE], private (auth/authAdmin)
     */
    deleteNotify: async (req, res) => {
        try {
            const contentNotifyDelete = await findOneAndDelete({ _id: req.params.id });
            return res.json({ message: 'Cập nhật thành công nội dung thông báo!', contentNotifyDelete });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

module.exports = notifyController;
