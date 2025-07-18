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

export default function DropDown({ onValueChange, items, label, value, empty=false, ariaLabel }) {
  const handleChange = (event) => {
    onValueChange(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 120 }} size="small">
      <InputLabel htmlFor={ariaLabel} aria-label={ariaLabel} id="dropdown-select-label">{label}</InputLabel>
      <Select
        //labelId="dropdown-select"
        aria-labelledby={ariaLabel}
        value={value}
        label={label}
        onChange={handleChange}
      >
        { empty && <MenuItem aria-label={`menu item blank`} value={""} key={"blank"} > &nbsp; </MenuItem> }
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