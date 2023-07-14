# React Router

A simple router for React apps.

## Installation

Using [npm](https://www.npmjs.com/):

```sh
$ npm i @joshdoesthis/react-router
```

Using [yarn](https://yarnpkg.com/):

```sh
$ yarn add @joshdoesthis/react-router
```

## Usage

### Basic Routes

```jsx
import { Router, Route, Link } from '@joshdoesthis/react-router'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link url='/page/1'>Page 1</Link>
      <Link url='/page/2'>Page 2</Link>
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

### Authenticated Routes

```jsx
import { Router, Route, Link } from '@joshdoesthis/react-router'
import { Auth, useAuth } from '../provider/auth'

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link url='/page/1'>Page 1</Link>
      <Link url='/page/2'>Page 2</Link>
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
  const { authenticated } = useAuth()

  return (
    <Router authenticated={authenticated}>
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

## Router

| Prop               | Type      | Description                                                                     |
| ------------------ | --------- | ------------------------------------------------------------------------------- |
| `authenticated`    | `boolean` | Whether or not the user is authenticated. Defaults to `false`.                  |
| `authRedirect`     | `string`  | The path to redirect to if the user is not authenticated. Defaults to `/login`. |
| `notFoundRedirect` | `string`  | The path to redirect to if the route is not found. Defaults to `/404`.          |

## Route

| Prop        | Type       | Description                                                            |
| ----------- | ---------- | ---------------------------------------------------------------------- |
| `auth`      | `boolean`  | Whether or not the route requires authentication. Defaults to `false`. |
| `notFound`  | `boolean`  | Whether or not the route is the not found route. Defaults to `false`.  |
| `path`      | `string`   | The path to match.                                                     |
| `component` | `function` | The component to render.                                               |

## Link

| Prop     | Type      | Description                                               |
| -------- | --------- | --------------------------------------------------------- |
| `url`    | `string`  | The path to link to.                                      |
| `ext`    | `boolean` | Whether or not the link is external. Defaults to `false`. |
| `target` | `string`  | The target of the link. Defaults to `_self`.              |
| `style`  | `object`  | The style of the link.                                    |
