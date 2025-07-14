import { useState } from "react";
import { 
    Box, 
    Typography, 
    Drawer, 
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material'; // direct imports are faster/smaller
import { bodyOrange, headerOrange, backgroundBrown } from '../constants';
import {
    ChevronLeftOutlined,
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
export function OptionsAccordion({ children }) {
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

export default function TemporaryDrawer({ children }) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };

    return (
        <Box>
            <Button onClick={toggleDrawer(true)}> <ChevronLeftOutlined /> Open drawer </Button>
            <Drawer open={openDrawer} onClose={toggleDrawer(false)} anchor="right">
                    <Box sx={{ backgroundColor: backgroundBrown}}>
                        <OptionsAccordion children={children} />
                    </Box>
                    <Box sx={{ backgroundColor: backgroundBrown, height: "calc(100vh - 60px)" }}></Box>
            </Drawer>
        </Box>
    );
}