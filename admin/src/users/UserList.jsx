import * as React from 'react'
import { List, Datagrid, BooleanField, TextField } from 'react-admin'

const UserList = (props) => (
  <List {...props} title="List of Users">
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField label="Local Email" source="local.email" />
      <TextField label="Google Id" source="google.id" />
      <BooleanField source="isAdmin" />
    </Datagrid>
  </List>
)

export default UserList
