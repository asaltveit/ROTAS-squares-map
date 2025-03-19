import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Typography } from '@mui/material';
import { bodyOrange, headerOrange } from '../constants/OptionsAccordion';

/*
Assumes:
    child = {
        header: string,
        body: component
    }
*/

export default function OptionsAccordion({ children }) {
    const [expanded, setExpanded] = React.useState('panel1');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <Box >
            {children?.map((child, index) => {
                return(
                    <Accordion 
                        key={index} 
                        expanded={expanded === `panel${index}-header`} 
                        onChange={handleChange(`panel${index}-header`)} 
                    >
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon />}
                            aria-controls={`panel${index}-header`}
                            id={`panel${index}-header`}
                            style={{backgroundColor: headerOrange}}
                        >
                            <Typography>{child.header}</Typography>
                        </AccordionSummary>
                        <AccordionDetails style={{backgroundColor: bodyOrange}}>
                            <Box sx={{margin: '10px'}}> {child.body} </Box>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
}