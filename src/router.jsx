import React, { createContext, useContext, useState, useEffect } from 'react'
import { URLPattern } from 'urlpattern-polyfill'

const RouterContext = createContext()

export const useRouter = () => useContext(RouterContext)

export const Router = ({
  children,
  authRedirect = '/login',
  notFoundRedirect = '/404',
  isAuthenticated = false
}) => {
  const [route, set_route] = useState({
    pathname: window.location.pathname,
    search: window.location.search,
    has_match: false,
    params: {}
  })
  const update_route = ({ pathname, search = '', has_match, params }) => {
    window.history.pushState(
      {
        previous: {
          pathname: route.pathname,
          search: route.search,
          has_match: route.has_match,
          params: route.params
        },
        current: {
          pathname: pathname,
          search: search,
          has_match: has_match,
          params: params
        }
      },
      null,
      pathname + search
    )
    set_route({
      pathname: pathname,
      search: search,
      has_match: has_match,
      params: params
    })
  }

  useEffect(() => {
    window.addEventListener('popstate', e => {
      const { current } = e.state ?? {}
      current ? set_route(current) : set_route({ ...route, has_match: false })
    })
    window.addEventListener('pushstate', () => {
      const { previous } = e.state ?? {}
      previous ? set_route(previous) : set_route({ ...route, has_match: false })
    })
  }, [])

  return (
    <RouterContext.Provider
      value={{
        isAuthenticated,
        authRedirect,
        notFoundRedirect,
        route,
        update_route
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
  const {
    isAuthenticated,
    authRedirect,
    notFoundRedirect,
    route,
    update_route
  } = useRouter()
  const current_pathname = route.pathname
  const current_search = route.search
  const url_pattern = new URLPattern({ pathname: path })
  const has_match = url_pattern.test({ pathname: current_pathname })

  useEffect(() => {
    if (
      auth &&
      !isAuthenticated &&
      has_match &&
      current_pathname !== authRedirect
    ) {
      update_route({ pathname: authRedirect, search: '' })
    }
    if (notFound && !route.has_match) {
      update_route({ pathname: notFoundRedirect, search: '' })
    }
  }, [route, isAuthenticated])

  if (notFound) return null
  if (has_match) {
    const pathname_params = url_pattern.exec({ pathname: current_pathname })
      .pathname.groups
    const search_params = Object.fromEntries(
      new URLSearchParams(current_search).entries()
    )
    route.pathname = current_pathname
    route.search = current_search
    route.has_match = has_match
    route.params = {
      ...pathname_params,
      ...search_params
    }

    return <Component route={route} />
  }

  return null
}

export const Link = ({ children, ext = false, url, target = '_self', tw }) => {
  const { route, update_route } = useRouter()
  const [pathname, search] = url.split('?')
  const active = route.pathname.includes(url)
  return (
    <a
      href={url}
      onClick={e => {
        if (!ext) {
          e.preventDefault()
          update_route({ pathname, search: search ? `?${search}` : '' })
        }
      }}
      target={target}
      data-active={active}
      className={tw}
    >
      {children}
    </a>
  )
}
