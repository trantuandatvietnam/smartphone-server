const router = require('express').Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const fs = require('fs');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * POST: api/upload
 * private
 */
router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ message: 'No files is uploaded!' });
        }
        const file = files.file;

        // condition upload file
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            //1024 * 1024 = 1mb
            return res.status(400).json({ message: 'file is too big size!' });
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: 'file is incorect!' });
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'smartphone' }, async (err, result) => {
            if (err) throw err;
            removeTmp(file.tempFilePath);
            return res.json({
                public_id: result.public_id,
                url: result.url,
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * DELETE: api/destroy
 */
router.post('/destroy', auth, authAdmin, async (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ message: 'Không có hình ảnh nào được chọn!' });
        }
        cloudinary.v2.uploader.destroy(public_id, (err, result) => {
            if (err) {
                throw err;
            }
            return res.json({ message: 'Deleted image' });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};
module.exports = router;
