import TextField from '@mui/material/TextField';

export default function NumberTextField({ name, value, onChange, error, helperText, required, short}) {
    let styles = {}
    if (short) {
        styles.width = '6em'
    }

    return (
        <TextField
            size="small"
            required={required}
            type="number"
            id={name}
            name={name}
            sx={styles}
            value={value}
            onChange={onChange}
            error={error}
            helperText={helperText}
            slotProps={{
                input: {
                    type: "number",
                    sx: {
                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                            display: 'none'
                        },
                        '& input[type=number]': {
                            MozAppearance: 'textfield'
                        },
                    }
                },
            }}
        />
    );
}