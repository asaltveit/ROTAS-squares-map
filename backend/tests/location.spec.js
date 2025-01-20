//const chai = require('chai');
import {expect} from 'chai';
//const expect = chai.expect;
//const sinon = require('sinon');
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
//const sinonChai = require('sinon-chai');
chai.use(sinonChai);

//const rewire = require('rewire');
import rewire from 'rewire';
//import { Sequelize, Model } from 'sequelize';
//const postgres = require('postgres');
//import postgres from 'postgres';
//const locationModel = require('../models/location');
import locationModel from '../models/location.js';
const sandbox = sinon.createSandbox();

let locationController = rewire('../controllers/locationController.js');

describe('Testing / endpoint', () => {
    let sampleItemVal;
    let findByPkStub;

    beforeEach(() => {
        sampleItemVal = {
            id: '75679679',
            type: 'sample item',
            createdYearStart: 10,
            longitude: 40.4,
            latitude: 30,
            createdYearEnd: null,
            discoveredYear: null,
            text: null,
            place: null,
            location: null,
            script: null,
            shelfmark: null,
            firstWord: null,
        };

        findByPkStub = sandbox.stub(locationModel, 'findByPk').resolves(sampleItemVal);
    });

    afterEach(() => {
        locationController = rewire('../controllers/locationController');
        sandbox.restore();
    });

    describe('GET /:hash', () => {
        it('should return error when called without id', async () => {
            let result;
            try{
                result = await locationController.readItem();
                throw new Error('⚠️ Unexpected success!');
            } catch(err) {
                // Will the error just go here?
                // Where does result come from?
                expect(result).to.be.instanceOf(Error);
                expect(err.message).to.equal('Invalid location id');
            }
        });

        it('should succeed when called with id', async () => {
            let location;
            try {
                location = await locationController.readItem('random id');
                expect(location).to.equal(sampleItemVal);
            } catch(err) {
                throw new Error('⚠️ Unexpected failure!');
            }
        });
    });
});