import { useState } from "react";
import OptionsAccordion from './OptionsAccordion';
import Box from '@mui/material/Box'; // direct imports are faster/smaller
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'; // direct imports are faster/smaller
import { backgroundBrown } from '../constants';



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