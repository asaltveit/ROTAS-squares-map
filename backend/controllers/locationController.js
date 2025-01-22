const Location = require('../models/location');
const _ = require('lodash');
// Controller method to get all locations, with filters
exports.getAllLocations = async (req, res) => {
    try {
        var filters = _.omitBy(req.query.filters, _.isNil);
        const locations = await Location.findAll({where: filters});
        res.json(locations);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
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
    //let g = 'Get /' + req.params.id + ' route'
    //res.send(g) // Testing the server
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
        const loc = await Location.findByPk(id);
        if (loc) {
            loc.type = type;
            loc.createdYearStart = createdYearStart;
            loc.createdYearEnd = createdYearEnd;
            loc.discoveredYear = discoveredYear;
            loc.longitude = longitude;
            loc.latitude = latitude;
            loc.text = text;
            loc.place = place;
            loc.location = location;
            loc.script = script;
            loc.shelfmark = shelfmark;
            loc.firstWord = firstWord;
            await loc.save();
            res.json(loc);
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

/*
{ 
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
        }


*/