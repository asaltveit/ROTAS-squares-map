import { object, string, number } from 'yup'


export const locationSchema = object({
    type: string().required().min(1).max(255), // length was for exact length
    createdYearStart: number().positive().max(2030).required(),
    createdYearEnd: number().positive().integer().max(2030),
    discoveredYear: number().positive().integer().max(2030),
    longitude: number().required().max(180).min(-180),
    latitude: number().required().max(90).min(-90),
    text: string().length(255),
    place: string().length(255),
    location: string().length(255),
    script: string().length(255),
    shelfmark: string().length(255),
    firstWord: string().length(255),
})