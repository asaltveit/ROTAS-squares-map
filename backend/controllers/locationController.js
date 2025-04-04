const Location = require('../models/location');
const _ = require('lodash');
// Controller method to get all locations, with filters
exports.getAllLocations = async (req, res) => {
    try {
        let filters = _.omitBy(req.query, _.isNil);
        const locations = await Location.findAll({where: filters});
        res.json(locations);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

// Controller methods to get list of distinct possible values for field
exports.getAllTypeValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['type'], group: ['type'], logging: console.log})
        const typeList = result.map((r) => r.type)
        res.json(typeList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllScriptValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['script'], group: ['script'], logging: console.log})
        const scriptList = result.map((r) => r.script)
        res.json(scriptList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllFirstWordValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['first_word'], group: ['first_word'], logging: console.log})
        const firstWordList = result.map((r) => r.first_word)
        res.json(firstWordList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllLocationValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['location'], group: ['location'], logging: console.log})
        const locationList = result.map((r) => r.location)
        res.json(locationList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllPlaceValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['place'], group: ['place'], logging: console.log})
        const placeList = result.map((r) => r.place)
        res.json(placeList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllTextValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['text'], group: ['text'], logging: console.log})
        const textList = result.map((r) => r.text)
        res.json(textList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

// TODO: move lat/lng changes to backend?
exports.getAllLatitudeValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['fixed_latitude'], group: ['fixed_latitude'], logging: console.log})
        const textList = result.map((r) => r.fixed_latitude)
        res.json(textList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

exports.getAllLongitudeValues = async (req, res) => {
    try {
        const result = await Location.findAll({attributes: ['fixed_longitude'], group: ['fixed_longitude'], logging: console.log})
        const textList = result.map((r) => r.fixed_longitude)
        res.json(textList);
    } catch (error) {
        res.status(500).json({error}); // : 'Internal Server Error'
    }
};

// Controller method to create a new location
exports.createLocation = async (req, res) => {
    console.log("req.body: ", req.body)
    
    try {
        const { 
            type, 
            created_year_start, 
            created_year_end, 
            discovered_year, 
            longitude,
            fixed_longitude,
            latitude,
            fixed_latitude,
            text, 
            place, 
            location, 
            script, 
            shelfmark, 
            first_word
        } = req.body?.data;
        const newLocation = await Location.create({
            type, 
            created_year_start, 
            created_year_end, 
            discovered_year, 
            longitude, 
            fixed_longitude,
            latitude, 
            fixed_latitude,
            text, 
            place, 
            location, 
            script, 
            shelfmark, 
            first_word,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error });
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