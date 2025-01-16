const Location = require('../models/location');
// Controller method to get all locations, with filters
exports.getAllLocations = async (req, res) => {
    try {
        var {
            type, 
            createdYearStart, 
            createdYearEnd, 
            discoveredYear, 
            longitude, 
            latitude, 
            text, 
            place, 
            location, 
            script, 
            shelfmark, 
            firstWord
        } = req.query.filters;
        var filters = _.omitBy({ 
            type: type, 
            createdYearStart: createdYearStart, 
            createdYearEnd: createdYearEnd, 
            discoveredYear: discoveredYear, 
            longitude: longitude, 
            latitude: latitude, 
            location: location, 
            text: text, 
            place: place, 
            script: script, 
            shelfmark: shelfmark, 
            firstWord: firstWord, 
        }, _.isNil);
        const locations = await Location.findAll({
            where: filters
        });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller method to create a new location
exports.createLocation = async (req, res) => {
    const { 
        type, 
        createdYearStart, 
        createdYearEnd, 
        discoveredYear, 
        longitude, 
        latitude, 
        text, 
        place, 
        location, 
        script, 
        shelfmark, 
        firstWord 
    } = req.body;
    try {
        const newLocation = await Location.create({
            type, 
            createdYearStart, 
            createdYearEnd, 
            discoveredYear, 
            longitude, 
            latitude, 
            text, 
            place, 
            location, 
            script, 
            shelfmark, 
            firstWord
        });
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Controller method to get a location by ID
exports.getLocationById = async (req, res) => {
    const id = req.params.id;
    try {
        const location = await Location.findByPk(id);
        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Controller method to update a location by ID
exports.updateLocation = async (req, res) => {
    const id = req.params.id;
    const { 
        type, 
        createdYearStart, 
        createdYearEnd, 
        discoveredYear, 
        longitude, 
        latitude, 
        text, 
        place, 
        location, 
        script, 
        shelfmark, 
        firstWord 
    } = req.body;
    try {
        const location = await Location.findByPk(id);
        if (location) {
            location.type = type;
            location.createdYearStart = createdYearStart;
            location.createdYearEnd = createdYearEnd;
            location.discoveredYear = discoveredYear;
            location.longitude = longitude;
            location.latitude = latitude;
            location.text = text;
            location.place = place;
            location.location = location;
            location.script = script;
            location.shelfmark = shelfmark;
            location.firstWord = firstWord;
            await location.save();
            res.json(location);
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Controller method to delete a location by ID
exports.deleteLocation = async (req, res) => {
    const id = req.params.id;
    try {
        const location = await Location.findByPk(id);
        if (location) {
            await location.destroy();
            res.json(location);
    } else {
        res.status(404).json({ error: 'Location not found' });
    }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};