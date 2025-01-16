const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
// Route to get all todos
router.get('/', locationController.getAllLocations);
// Route to create a new todo
router.post('/', locationController.createLocation);
// Route to get a todo by ID
router.get('/:id', locationController.getLocationById);
// Route to update a todo by ID
router.put('/:id', locationController.updateLocation);
// Route to delete a todo by ID
router.delete('/:id', locationController.deleteLocation);
module.exports = router;