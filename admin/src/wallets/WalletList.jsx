import * as React from "react"
import { List, Datagrid, TextField } from 'react-admin'

const WalletList = (props) => (
    <List {...props} title="List of Wallets">
        <Datagrid rowClick='edit'>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="link" />
        </Datagrid>
    </List>
)

export default WalletList