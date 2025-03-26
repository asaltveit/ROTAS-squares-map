import Form from '../components/Form'
import React from 'react';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import userEvent from '@testing-library/user-event'


describe('Form', () => {
    beforeEach(async () => {
        vi.mock('axios');
        const mockData = { data: [40.75080889, 40.7501907] };
        axios.get.mockResolvedValue(mockData);
    })
    describe('Add type', () => {
        it('renders correctly', () => {
            render(<Form />);
            
            // Years created range
            const startYear = screen.getByLabelText('Years created*');
            expect(startYear).toBeInTheDocument();
    
            const endYear = screen.getByLabelText('to');
            expect(endYear).toBeInTheDocument();
    
            // Columns
            const yearRange = screen.getByLabelText('Shelfmark');
            expect(yearRange).toBeInTheDocument();
    
            const place = screen.getByLabelText('Place');
            expect(place).toBeInTheDocument();
            
            const type = screen.getByLabelText('Type*');
            expect(type).toBeInTheDocument();
    
            const script = screen.getByLabelText('Script');
            expect(script).toBeInTheDocument();
    
            const text = screen.getByLabelText('Text');
            expect(text).toBeInTheDocument();
    
            const firstWord = screen.getByLabelText('First word');
            expect(firstWord).toBeInTheDocument();
    
            const location = screen.getByLabelText('Location');
            expect(location).toBeInTheDocument();
    
            const latitude = screen.getByLabelText('Latitude*');
            expect(latitude).toBeInTheDocument();

            const longitude = screen.getByLabelText('Longitude*');
            expect(longitude).toBeInTheDocument();

            const saveButton = screen.getByText('Save');
            expect(saveButton).toBeInTheDocument();
        }) 
        describe('Field error messages', () => {
            it('Start year created', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const startYear = screen.getByLabelText('Years created*');
                const saveButton = screen.getByText('Save');
            
                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                const helperText = screen.queryByText('createdYearStart is a required field');
                expect(helperText).toBeInTheDocument();

                await user.type(startYear, '9')
                expect(helperText).not.toBeInTheDocument();
            })
            it('End year created', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const endYear = screen.getByLabelText('to');
                const saveButton = screen.getByText('Save');
            
                await user.type(endYear, 'a')

                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });

                await new Promise((r) => setTimeout(r, 1000));
                const helperText = screen.queryByText('createdYearEnd must be a `number` type, but the final value was: `NaN` (cast from the value `"a"`).');
                expect(helperText).toBeInTheDocument();

                await user.clear(endYear)
                expect(helperText).not.toBeInTheDocument();
            })
            it('Type', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const typeField = screen.getByLabelText('Type*');
                const saveButton = screen.getByText('Save');
            
                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                const helperText = screen.queryByText('type is a required field');
                expect(helperText).toBeInTheDocument();

                await user.type(typeField, 'a')
                expect(helperText).not.toBeInTheDocument();
            })
            it('Latitude', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const latitudeField = screen.getByLabelText('Latitude*');
                const saveButton = screen.getByText('Save');
            
                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                const helperText = screen.queryByText('latitude is a required field');
                expect(helperText).toBeInTheDocument();

                await user.type(latitudeField, '9')
                expect(helperText).not.toBeInTheDocument();
            })
            it('Longitude', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const longitudeField = screen.getByLabelText('Longitude*');
                const saveButton = screen.getByText('Save');
            
                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                const helperText = screen.queryByText('longitude is a required field');
                expect(helperText).toBeInTheDocument();

                await user.type(longitudeField, '9')
                expect(helperText).not.toBeInTheDocument();
            })
            it('Discovered year', async () => {
                render(<Form />);
                const user = userEvent.setup()
                const discoveredYearField = screen.getByLabelText('Discovered Year');
                const saveButton = screen.getByText('Save');
            
                await user.type(discoveredYearField, 'k')

                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                
                const helperText = screen.queryByText('discoveredYear must be a `number` type, but the final value was: `NaN` (cast from the value `"k"`).');
                expect(helperText).toBeInTheDocument();

                await user.clear(discoveredYearField)
                expect(helperText).not.toBeInTheDocument();
            })
        })
        describe('Saving', () => {
            beforeEach(() => {
                vi.mock('axios');
            });
            it('is waiting', async() => {
                axios.post.mockImplementation(() => new Promise(() => {}));
                render(<Form />);
                const user = userEvent.setup()
                const startYear = screen.getByLabelText('Years created*');
                const typeField = screen.getByLabelText('Type*');
                const latitudeField = screen.getByLabelText('Latitude*');
                const longitudeField = screen.getByLabelText('Longitude*');
                const saveButton = screen.getByText('Save');

                await user.type(startYear, '5')
                await user.type(typeField, 'book')
                await user.type(latitudeField, '9.8')
                await user.type(longitudeField, '-42')

                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                expect(axios.post).toBeCalled()
                const saving = screen.getByText('Saving...');
                expect(saving).toBeInTheDocument();
            })
            it('is successful', async () => {
                const mockedResponse = {
                    status: 200,
                };

                axios.post.mockResolvedValue(mockedResponse);
                render(<Form />);
                const user = userEvent.setup()
                const startYear = screen.getByLabelText('Years created*');
                const typeField = screen.getByLabelText('Type*');
                const latitudeField = screen.getByLabelText('Latitude*');
                const longitudeField = screen.getByLabelText('Longitude*');
                const saveButton = screen.getByText('Save');

                await user.type(startYear, '5')
                await user.type(typeField, 'book')
                await user.type(latitudeField, '9.8')
                await user.type(longitudeField, '-42')

                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                expect(axios.post).toBeCalled()
                const checkmark = screen.getByLabelText('success-checkmark');
                expect(checkmark).toBeInTheDocument();
            })
            it('is unsuccessful', async () => {
                const mockedResponse = {
                    status: 404,
                };

                axios.post.mockResolvedValue(mockedResponse);
                render(<Form />);
                const user = userEvent.setup()
                const startYear = screen.getByLabelText('Years created*');
                const typeField = screen.getByLabelText('Type*');
                const latitudeField = screen.getByLabelText('Latitude*');
                const longitudeField = screen.getByLabelText('Longitude*');
                const saveButton = screen.getByText('Save');

                await user.type(startYear, '5')
                await user.type(typeField, 'book')
                await user.type(latitudeField, '9.8')
                await user.type(longitudeField, '-42')

                act(() => {
                    /* fire events that update state */
                    fireEvent.click(saveButton)
                });
                await new Promise((r) => setTimeout(r, 1000));
                expect(axios.post).toBeCalled()
            })
        })
    })
    describe('Update type', () => {
        it('renders correctly', () => {
            render(<Form />);
            const updateRadio = screen.getByLabelText('Update');
            act(() => {
                /* fire events that update state */
                fireEvent.click(updateRadio)
            });
            const message = screen.getByText('Coming soon!');
            expect(message).toBeInTheDocument();
        })
    })
    describe('Delete type', () => {
        it('renders correctly', () => {
            render(<Form />);
            const deleteRadio = screen.getByLabelText('Delete');
            act(() => {
                /* fire events that update state */
                fireEvent.click(deleteRadio)
            });
            const message = screen.getByText('Coming soon!');
            expect(message).toBeInTheDocument();
        })
    })
})