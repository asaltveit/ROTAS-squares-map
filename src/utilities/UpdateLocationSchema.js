import { object, string, number } from 'yup'


export const locationSchema = object({
    location_type: string().required().min(1).max(255),
    created_year_start: number().positive().max(2030).required(),
    created_year_end: number().nullable().optional(), 
    discovered_year: number().nullable().optional(), 
    fixed_longitude: number().required().max(180).min(-180),
    fixed_latitude: number().required().max(90).min(-90),
    text: string().max(255),
    place: string().max(255),
    location: string().max(255),
    script: string().max(255),
    shelfmark: string().max(255),
    first_word: string().max(255),
})