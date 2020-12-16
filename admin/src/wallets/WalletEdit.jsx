import * as React from "react"
import { Edit, SimpleForm, TextInput } from 'react-admin';

const WalletEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput fullWidth disabled label="Id" source="id" />
            <TextInput fullWidth source="name" />
            <TextInput fullWidth source="link" type="url" />
            <TextInput fullWidth multiline source="description" />
        </SimpleForm>
    </Edit>
)

export default WalletEdit