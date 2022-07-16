const Banner = require("../models/BannerModel");

const bannerController = {
    getBanners: (req,res) => {
        try {
            const banners = await Banner.find();
            return res.json({banners})
        } catch (error) {
            return res.status(500).json({message: error.message})
        }
    }
}

module.exports = bannerController;