const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
// Route to get all locations
router.get('/', locationController.getAllLocations);
// Route to get a location by ID
router.get('/:id', locationController.getLocationById);
// Route to create a new location
router.post('/', locationController.createLocation);
// Route to update a location by ID
router.put('/:id', locationController.updateLocation);
// Route to delete a location by ID
router.delete('/:id', locationController.deleteLocation);

// Route to get all possible type values
router.get('/types', locationController.getAllTypeValues);
// Route to get all possible script values
router.get('/scripts', locationController.getAllScriptValues);
// Route to get all possible first_word values
router.get('/words', locationController.getAllFirstWordValues);
// Route to get all possible location values
router.get('/locations', locationController.getAllLocationValues);
// Route to get all possible place values
router.get('/places', locationController.getAllPlaceValues);
// Route to get all possible text values
router.get('/texts', locationController.getAllTextValues);

module.exports = router;