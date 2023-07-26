import { createContext, useContext, useState, useEffect } from 'react'
import { URLPattern } from 'urlpattern-polyfill'

const RouterContext = createContext({})

export const Router = ({
  children,
  authenticated = false,
  authRedirect = '/login',
  notFoundRedirect = '/404'
}) => {
  const [state, setState] = useState({
    routes: []
  })
  const [listeners, setListeners] = useState([])
  const [id, setId] = useState(0)

  const subscribe = listener => {
    const newId = id + 1
    setId(newId)
    setListeners(listeners => [...listeners, { id: newId, listener }])
    return newId
  }

  const unsubscribe = id => {
    setListeners(listeners => listeners.filter(listener => listener.id !== id))
  }

  const set = fn => {
    if (typeof fn === 'function') setState(state => fn(state))
    else setState(state => ({ ...state, ...fn }))
  }

  const get = () => state

  useEffect(() => listeners.forEach(({ listener }) => listener(state)), [state])

  const route = () => {
    if (state.routes.length === 0) return
    const match = state.routes.find(({ path }) => {
      const pattern = new URLPattern({ pathname: path })
      return pattern.test({ pathname: window.location.pathname })
    })
    if (match && match.auth && !authenticated) {
      window.history.pushState(null, null, authRedirect)
      set({ current: authRedirect, href: window.location.href, params: {} })
      return
    }
    if (match) {
      const pattern = new URLPattern({ pathname: match.path })
      const pathParams = pattern.exec({
        pathname: window.location.pathname
      }).pathname.groups
      const searchParams = Object.fromEntries(
        new URLSearchParams(window.location.search).entries()
      )
      set({
        current: match.path,
        href: window.location.href,
        params: { ...pathParams, ...searchParams }
      })
      return
    }
    window.history.pushState(null, null, notFoundRedirect)
    set({ current: notFoundRedirect, href: window.location.href, params: {} })
  }

  const navigate = path => {
    window.history.pushState(null, null, path)
    route()
  }

  useEffect(() => {
    route()
  }, [state.routes, authenticated])

  return (
    <RouterContext.Provider
      value={{
        authenticated,
        authRedirect,
        notFoundRedirect,
        subscribe,
        unsubscribe,
        set,
        get,
        navigate
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export const useRouter = () => {
  const {
    authenticated,
    authRedirect,
    notFoundRedirect,
    subscribe,
    unsubscribe,
    set,
    get,

    navigate
  } = useContext(RouterContext)
  const [state, setState] = useState(get())

  const globalSetState = globalState => setState(globalState)

  useEffect(() => {
    const id = subscribe(globalSetState)
    return () => unsubscribe(id)
  }, [])

  return {
    authenticated,
    authRedirect,
    notFoundRedirect,
    state,
    set,
    navigate
  }
}
