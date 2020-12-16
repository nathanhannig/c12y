import * as React from "react"
import { Edit, SimpleForm, BooleanInput, TextInput } from 'react-admin';

const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput fullWidth disabled label="Id" source="id" />
            <TextInput fullWidth source="firstName" />
            <TextInput fullWidth source="lastName" type="url" />
            <TextInput fullWidth disabled source="email" type="email" />
            <TextInput fullWidth disabled source="provider" />
            <TextInput fullWidth disabled source="googleId" />
            <BooleanInput source="isAdmin" />
        </SimpleForm>
    </Edit>
)

export default UserEdit