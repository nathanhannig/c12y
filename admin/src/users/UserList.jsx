import * as React from "react"
import { List, Datagrid, BooleanField, TextField } from 'react-admin'

const UserList = (props) => (
    <List {...props} title="List of Users">
        <Datagrid rowClick='edit'>
            <TextField source="id" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="email" />
            <TextField source="provider" />
            <BooleanField source="isAdmin" />
        </Datagrid>
    </List>
)

export default UserList