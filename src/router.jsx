import React, { createContext, useContext, useState, useEffect } from 'react'
import { URLPattern } from 'urlpattern-polyfill'

const RouterContext = createContext()
export const useRouter = () => useContext(RouterContext)

export const Router = ({
  children,
  authRedirect = '/login',
  notFoundRedirect = '/404',
  authenticated = false
}) => {
  const [route, setRoute] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
    match: false,
    params: {}
  })
  const navigate = (url, { pathname, search = '', match, params } = {}) => {
    if (url) pathname = url
    window.history.pushState(
      {
        previous: {
          pathname: route.pathname,
          search: route.search,
          match: route.match,
          params: route.params
        },
        current: {
          pathname: pathname,
          search: search,
          match: match,
          params: params
        }
      },
      null,
      pathname + search
    )
    setRoute({
      pathname: pathname,
      search: search,
      match: match,
      params: params
    })
  }

  useEffect(() => {
    window.addEventListener('popstate', e => {
      const { current } = e.state ?? {}
      current ? setRoute(current) : setRoute({ ...route, match: false })
    })
    window.addEventListener('pushstate', () => {
      const { previous } = e.state ?? {}
      previous ? setRoute(previous) : setRoute({ ...route, match: false })
    })
  }, [])

  return (
    <RouterContext.Provider
      value={{
        authenticated,
        authRedirect,
        notFoundRedirect,
        route,
        navigate
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export const Route = ({
  auth = false,
  notFound = false,
  path,
  component: Component
}) => {
  const { authenticated, authRedirect, notFoundRedirect, route, navigate } =
    useRouter()
  const currentPathname = route.pathname
  const currentSearch = route.search
  const pattern = new URLPattern({ pathname: path })
  const match = pattern.test({ pathname: currentPathname })

  useEffect(() => {
    if (auth && !authenticated && match && currentPathname !== authRedirect) {
      navigate(null, { pathname: authRedirect, search: '' })
    }
    if (notFound && !route.match) {
      navigate(null, { pathname: notFoundRedirect, search: '' })
    }
  }, [route])

  if (notFound) return null
  if (match) {
    const pathnameParams = pattern.exec({ pathname: currentPathname }).pathname
      .groups
    const searchParams = Object.fromEntries(
      new URLSearchParams(currentSearch).entries()
    )
    route.pathname = currentPathname
    route.search = currentSearch
    route.match = match
    route.params = {
      ...pathnameParams,
      ...searchParams
    }

    return <Component route={route} />
  }

  return null
}

export const Link = ({
  children,
  ext = false,
  url = '/',
  target = '_self',
  style = ''
}) => {
  const { route, navigate } = useRouter()
  const [pathname, search] = url.split('?')
  const active = route.pathname.includes(url)
  return (
    <a
      href={url}
      target={target}
      style={style}
      data-active={active}
      onClick={e => {
        if (!ext) {
          e.preventDefault()
          navigate(null, { pathname, search: search ? `?${search}` : '' })
        }
      }}
    >
      {children}
    </a>
  )
}
