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
    label = string,
    value = string, 
*/

export default function DropDown({ onValueChange, items, label, value, empty=false }) {

  const handleChange = (event) => {
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
        { empty && <MenuItem aria-label={`menu item blank`} value={""} key={"blank"} >  </MenuItem> }
        {items.map((item) => {
              return (
                <MenuItem aria-label={`menu item ${item?.title}`} value={item?.value} key={item?.value} > { item?.title } </MenuItem>
              )
            }
        )}
      </Select>
    </FormControl>
  );
}