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

export default function DropDown({ onValueChange, items, label, other=false }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
      <InputLabel aria-label="dropdown-select-label" id="dropdown-select-label">{label}</InputLabel>
      <Select
        labelId="dropdown-select"
        aria-label="dropdown-select"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={handleChange}
      >
        {items.map((item) => {
              return (
                <MenuItem aria-label={`menu item ${item?.title}`} value={item?.value} key={item?.value} > { item?.title } </MenuItem>
              )
            }
        )}
        {other && <MenuItem aria-label={`menu item other`} value={"other"} key={"other"} > <em> Other </em> </MenuItem>}
      </Select>
    </FormControl>
  );
}