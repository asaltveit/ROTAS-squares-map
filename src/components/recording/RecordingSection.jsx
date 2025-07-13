import { Box, Stack, Typography } from '@mui/material';
import Recorder from './ScreenRecorder';
import Screenshot from './Screenshot';
import Video from './Video'; // <Video /> // not working

export default function RecordingSection({ screenRef }) {
    return (
        <Box >
            <Stack>
                <Typography> Take a screenshot </Typography>
                <Screenshot screenRef={screenRef} />
                <Typography> Take a screen recording </Typography>
                <Recorder scroll={scroll} />
            </Stack>
        </Box>
    );
}