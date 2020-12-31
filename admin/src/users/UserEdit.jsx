import * as React from "react"
import { Edit, SimpleForm, BooleanInput, TextInput } from 'react-admin';

const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput fullWidth disabled label="Id" source="id" />
            <TextInput fullWidth source="firstName" />
            <TextInput fullWidth source="lastName" />
            <BooleanInput source="isAdmin" />
            <TextInput fullWidth disabled source="local.email" type="email" />
            <TextInput fullWidth disabled source="google.id" />
            <TextInput fullWidth disabled source="google.email" type="email" />
        </SimpleForm>
    </Edit>
)

export default UserEdit