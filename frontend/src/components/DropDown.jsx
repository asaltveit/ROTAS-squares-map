import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/*
Assumes:
    items = [
        {
            title: string,
            value: any,
        }
    ],
    onValueChange = () => {}, // sets value in parent
    label = string
*/

export default function DropDown({ onValueChange, items, label, formik, other=false }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
      <InputLabel id="dropdown-select-label">{label}</InputLabel>
      <Select
        labelId="dropdown-select-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={handleChange}
        error={
            formik && formik.touched.type && Boolean(formik.errors.type)
        }
      >
        {items.map((item) => {
              return (
                <MenuItem value={item.value} key={item.value} > { item.title } </MenuItem>
              )
            }
        )}
        {other && <MenuItem value={"other"} key={"other"} > <em> Other </em> </MenuItem>}
      </Select>
      {formik && formik.touched.type && <FormHelperText>{ formik.errors.type }</FormHelperText>}
    </FormControl>
  );
}