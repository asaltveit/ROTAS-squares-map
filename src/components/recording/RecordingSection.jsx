import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Recorder from './ScreenRecorder';
import Screenshot from './Screenshot';
import Video from './Video'; // <Video /> // not working

export default function RecordingSection({ screenRef }) {
    return (
        <Box >
            <Stack>
                <Typography variant="h6"> Take a screenshot </Typography>
                <Screenshot screenRef={screenRef} />
                <Typography variant="h6" > Take a screen recording </Typography>
                <Recorder scroll={scroll} />
            </Stack>
        </Box>
    );
}