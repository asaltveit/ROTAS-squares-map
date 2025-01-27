import { object, string, number } from 'yup'


export const locationSchema = object({
    type: string().required().length(255),
    created_year_start: number().required().positive().integer(),
    created_year_end: number().positive().integer(),
    discovered_year: number().positive().integer(),
    longitude: number().required().max(180).min(-180),
    latitude: number().required().max(90).min(-90),
    text: string().length(255),
    place: string().length(255),
    location: string().length(255),
    script: string().length(255),
    shelfmark: string().length(255),
    first_word: string().length(255),
})