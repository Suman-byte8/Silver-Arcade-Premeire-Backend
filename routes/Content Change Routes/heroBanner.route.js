const router = require('express').Router();
const { getHeroBanner, addHeroBanner, updateHeroBanner, deleteHeroBanner } = require('../../controllers/Dynamic Content/Home Page/heroBanner.controller');
const { protect, authorize } = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadMiddleware');

// get hero banner
router.get('/hero-banner', protect, getHeroBanner);
// add hero banner
router.post('/add-hero-banner', protect, authorize('admin'),upload.single('image'), addHeroBanner);
// update hero banner
router.put('/update-hero-banner/:id', protect, authorize('admin'),upload.single('image'), updateHeroBanner);
// delete hero banner
router.delete('/delete-hero-banner/:id', protect, authorize('admin'), deleteHeroBanner);


module.exports = router;