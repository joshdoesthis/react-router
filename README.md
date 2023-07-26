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
import { Router, Route, Link, useRouter } from '@joshdoesthis/react-router'

const Home = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Home</h1>
      <Link path='/page/1'>Page 1</Link>
      <Link path='/page/2'>Page 2</Link>
      <button onClick={() => router.navigate('/page/3')}>Page 3</button>
    </div>
  )
}

const Page = () => {
  const router = useRouter()
  const { params } = router.state

  return <h1>Page: {params.pageId}</h1>
}

const NotFound = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Not Found</h1>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Route path='/' component={Home} />
      <Route path='/page/:pageId' component={Page} />
      <Route path='/404' component={NotFound} />
    </Router>
  )
}
```

### Authenticated Routes

```jsx
import { Router, Route, Link, useRouter } from '@joshdoesthis/react-router'
import { Auth, useAuth } from '../provider/auth'

const Home = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Home</h1>
      <Link path='/page/1'>Page 1</Link>
      <Link path='/page/2'>Page 2</Link>
      <button onClick={() => router.navigate('/page/3')}>Page 3</button>
    </div>
  )
}

const Page = () => {
  const router = useRouter()
  const { params } = router.state

  return <h1>Page: {params.pageId}</h1>
}

const Login = () => {
  return <h1>Login</h1>
}

const NotFound = () => {
  const router = useRouter()

  return (
    <div>
      <h1>Not Found</h1>
      <button onClick={() => router.back()}>Go Back</button>
    </div>
  )
}

const App = () => {
  const auth = useAuth()

  return (
    <Router authenticated={auth.state.authenticated}>
      <Route path='/' component={Home} />
      <Route auth path='/page/:pageId' component={Page} />
      <Route path='/login' component={Login} />
      <Route path='/404' component={NotFound} />
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
| `path`   | `string`  | The path to link to.                                      |
| `ext`    | `boolean` | Whether or not the link is external. Defaults to `false`. |
| `target` | `string`  | The target of the link. Defaults to `_self`.              |
| `style`  | `object`  | The style of the link.                                    |

## useRouter

| Prop       | Type                     | Description                          |
| ---------- | ------------------------ | ------------------------------------ |
| `state`    | `object`                 | The current state of the router.     |
| `navigate` | `(path: string) => void` | Navigates to the specified path.     |
| `back`     | `() => void`             | Navigates back to the previous path. |
