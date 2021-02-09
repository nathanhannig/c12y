import { Admin, Resource } from 'react-admin'

import authProvider from './authProvider'
import dataProvider from './dataProvider/index.js'

import exchanges from './exchanges'
import wallets from './wallets'
import users from './users'

const customDataProvider = dataProvider('../api')

const App = () => {
  return (
    <Admin authProvider={authProvider} dataProvider={customDataProvider}>
      <Resource name="users" {...users} />
      <Resource name="exchanges" {...exchanges} />
      <Resource name="wallets" {...wallets} />
    </Admin>
  )
}

export default App
