const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');

// functions for home page content management
const HeroBannerModel = require("../../../schema/Client Content Models/Home/HeroBanner.model");

async function addHeroBanner(req, res) {
    try {
        const { title, subtitle, description, url } = req.body; // remove 'image'
        const imageFile = req.file;

        // Validate required fields
        if (!title || !description || !url || !imageFile) { // check for imageFile
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Upload image to Cloudinary using a stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'hero_banners',
                resource_type: 'image'
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
                }

                // Create hero banner with the uploaded image URL
                const heroBanner = await HeroBannerModel.create({
                    title,
                    subtitle,
                    description,
                    image: result.secure_url, // Use the URL from Cloudinary result
                    url,
                    page: 'home',
                    section: 'hero',
                    isActive: true
                });

                res.status(201).json({
                    success: true,
                    message: 'Hero banner added successfully',
                    heroBanner
                });
            }
        );

        // Pipe the file buffer into the Cloudinary upload stream
        streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);

    } catch (error) {
        console.error('Error adding hero banner:', error);
        res.status(500).json({ message: 'Server error while adding hero banner' });
    }
}

// updateHeroBanner function
async function updateHeroBanner(req, res) {
    try {
        const { id } = req.params;
        const { title, subtitle, description, url } = req.body;
        const imageFile = req.file;

        // Basic validation for text fields
        if (!title || !description || !url) {
            return res.status(400).json({ message: 'Title, description, and URL are required' });
        }

        const heroBanner = await HeroBannerModel.findById(id);
        if (!heroBanner) {
            return res.status(404).json({ message: 'Hero banner not found' });
        }

        // This function will handle the final update and response
        const finalUpdate = async (imageUrl) => {
            heroBanner.title = title;
            heroBanner.subtitle = subtitle;
            heroBanner.description = description;
            heroBanner.url = url;
            if (imageUrl) {
                heroBanner.image = imageUrl;
            }
            await heroBanner.save();
            res.status(200).json({
                success: true,
                message: 'Hero banner updated successfully',
                heroBanner
            });
        };

        // If a new image is uploaded, upload it to Cloudinary
        if (imageFile) {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'hero_banners',
                    resource_type: 'image'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
                    }
                    finalUpdate(result.secure_url);
                }
            );
            streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);
        } else {
            // If no new image, just update the text fields
            finalUpdate();
        }

    } catch (error) {
        console.error('Error updating hero banner:', error);
        res.status(500).json({ message: 'Server error while updating hero banner' });
    }
}

// deleteHeroBanner function
async function deleteHeroBanner(req, res) {
    try {
        const { id } = req.params;

        // Find the hero banner by ID
        const heroBanner = await HeroBannerModel.findById(id);
        if (!heroBanner) {
            return res.status(404).json({ message: 'Hero banner not found' });
        }
        // Delete the hero banner
        await heroBanner.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Hero banner deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting hero banner:', error);
        res.status(500).json({ message: 'Server error while deleting hero banner' });
    }
}

// getHeroBanner function
async function getHeroBanner(req, res) {
    try {
        const heroBanners = await HeroBannerModel.find({ page: 'home', section: 'hero' });
        res.status(200).json({
            success: true,
            heroBanners
        });
    } catch (error) {
        console.error('Error fetching hero banners:', error);
        res.status(500).json({ message: 'Server error while fetching hero banners' });
    }
}


module.exports = { addHeroBanner, updateHeroBanner, deleteHeroBanner, getHeroBanner }