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

  const set = newState => {
    if (typeof newState === 'function') setState(state => newState(state))
    else setState(state => ({ ...state, ...newState }))
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

  const back = () => {
    window.history.back()
    route()
  }

  useEffect(() => {
    route()
  }, [state.routes, authenticated])

  useEffect(() => {
    window.addEventListener('popstate', route)
    return () => window.removeEventListener('popstate', route)
  }, [state.routes])

  return (
    <RouterContext.Provider
      value={{
        subscribe,
        unsubscribe,
        set,
        get,
        navigate,
        back
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export const useRouter = () => {
  const { subscribe, unsubscribe, set, get, navigate, back } =
    useContext(RouterContext)
  const [state, setState] = useState(get())

  useEffect(() => {
    const id = subscribe(state => setState(state))
    return () => unsubscribe(id)
  }, [])

  return {
    state,
    set,
    navigate,
    back
  }
}
