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


// routes for curated offers
const { addOffers, updateOffers, deleteOffers, getOffers } = require('../../controllers/Dynamic Content/Home Page/curatedOffer.controller');
 // Add Curated Offers
router.post('/add-curated-offer', protect, authorize('admin'), upload.single('image'), addOffers);
// Update Curated Offers
router.put('/update-curated-offer/:id', protect, authorize('admin'), upload.single('image'), updateOffers);
// Delete Curated Offers
router.delete('/delete-curated-offer/:id', protect, authorize('admin'), deleteOffers);
// Get Curated Offers
router.get('/get-curated-offers', protect, getOffers);

// routes for footer links
const { addFooterLinks, getFooterLinks, updateFooterLink, deleteFooterLink } = require('../../controllers/Dynamic Content/Home Page/footer.controller');
// Add Footer Links
router.post('/add-footer-link', protect, authorize('admin'), addFooterLinks);
// Get Footer Links
router.get('/get-footer-links', protect, getFooterLinks);
// Update Footer Link
router.put('/update-footer-link/:id', protect, authorize('admin'), updateFooterLink);
// Delete Footer Link
router.delete('/delete-footer-link/:id', protect, authorize('admin'), deleteFooterLink);



module.exports = router;