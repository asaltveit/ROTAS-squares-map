import { useState } from "react";
import { 
    Box, 
    Typography, 
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'; // direct imports are faster/smaller
import { bodyOrange, headerOrange } from '../constants';
import {
    ArrowDropDown
} from '@mui/icons-material'; // direct imports are faster/smaller

/*
Assumes:
    child = {
        header: string,
        body: component,
        icon: component,
    }
*/

// want just button - width of heading?
export default function OptionsAccordion({ children }) {
    const [expanded, setExpanded] = useState('panel1');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <Box>
            {children?.map((child, index) => {
                return(
                    <Accordion 
                        key={index} 
                        expanded={expanded === `panel${index}-header`} 
                        onChange={handleChange(`panel${index}-header`)} 
                    >
                        <AccordionSummary
                            expandIcon={<ArrowDropDown />}
                            aria-controls={`panel${index}-header`}
                            id={`panel${index}-header`}
                            sx={{backgroundColor: headerOrange}}
                        >
                            <Typography> {child.icon} {child.header} </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{backgroundColor: bodyOrange}}>
                            <Box sx={{margin: '10px'}}> {child.body} </Box>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}