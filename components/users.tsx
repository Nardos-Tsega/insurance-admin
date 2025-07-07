import { List, Datagrid, TextField, ReferenceField } from 'react-admin';

export const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="role" />
      <ReferenceField source="company_id" reference="companies" link={false}>
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
);
