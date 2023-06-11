# React Router

## Installation

Using [npm](https://www.npmjs.com/):

```sh
$ npm i react-router
```

Using [yarn](https://yarnpkg.com/):

```sh
$ yarn add react-router
```

## Usage

```js
import { Router, Route, Link } from '@joshdoesthis/react-router'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link url='/page/1'>Page 1</Link>
      <Link url='/page/2'>Page 2</Link>
      <Link ext url='https://www.npmjs.com'>
        NPM
      </Link>
    </div>
  )
}

const Page = ({ route: { params } }) => {
  return <h1>Page: {params.page_id}</h1>
}

const NotFound = () => {
  return <h1>Not Found</h1>
}

const App = () => {
  return (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/page/:page_id' component={Page} />
      <Route path='/404' component={NotFound} />
      <Route notFound />
    </Router>
  )
}
```

## Authenticated Routes

```js
import { Router, Route, Link } from '@joshdoesthis/react-router'
import { Auth, useAuth } from '../provider/auth'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link url='/page/1'>Page 1</Link>
      <Link url='/page/2'>Page 2</Link>
      <Link ext url='https://www.npmjs.com'>
        NPM
      </Link>
    </div>
  )
}

const Page = ({ route: { params } }) => {
  return <h1>Page: {params.page_id}</h1>
}

const Login = () => {
  return <h1>Login</h1>
}

const NotFound = () => {
  return <h1>Not Found</h1>
}

const App = () => {
  // The auth provider should return a boolean value for `is_authenticated`
  const { is_authenticated } = useAuth()

  return (
    <Router isAuthenticated={is_authenticated}>
      <Route path='/' component={Home} />
      <Route auth path='/page/:page_id' component={Page} />
      <Route path='/login' component={Login} />
      <Route path='/404' component={NotFound} />
      <Route notFound />
    </Router>
  )
}

const AuthenticatedApp = () => {
  return (
    <Auth>
      <App />
    </Auth>
  )
}
```
