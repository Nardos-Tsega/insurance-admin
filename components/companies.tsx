import { List, Datagrid, TextField, EditButton } from 'react-admin';

export const CompanyList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="created_at" />
      <EditButton />
    </Datagrid>
  </List>
);
