import Box from '@mui/material/Box';
import Form from '../components/Form';

export const formTypes = {
    add: "add",
    update: "update",
    delete: "delete",
}

export const accordionChildren = [
    {
      header: "Filters",
      body: <Box>TODO</Box>,
    },
    {
      header: "Manipulate Data",
      body: <Form />,
    },
  ]