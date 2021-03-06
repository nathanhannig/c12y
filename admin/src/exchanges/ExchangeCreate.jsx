import * as React from 'react'
import { Create, SimpleForm, TextInput } from 'react-admin'

const ExchangeCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput fullWidth source="name" />
      <TextInput fullWidth source="link" type="url" />
      <TextInput fullWidth multiline source="description" />
    </SimpleForm>
  </Create>
)

export default ExchangeCreate
