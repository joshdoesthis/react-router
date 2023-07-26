import { useEffect } from 'react'
import { useRouter } from './router'

export const Route = ({ auth = false, path, component: Component }) => {
  const router = useRouter()

  useEffect(() => {
    if (path)
      router.set(state => ({
        ...state,
        routes: [...state.routes, { auth, path }]
      }))
  }, [])

  if (path && router.state.current === path) {
    return <Component />
  }

  return null
}
