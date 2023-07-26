import React, { useRouter } from './router'

export const Link = ({
  children,
  ext = false,
  path = '/',
  target = '_self',
  style = ''
}) => {
  const router = useRouter()
  const active = router.state.href.includes(path)
  return (
    <a
      href={path}
      target={target}
      className={style}
      active={active ? 'true' : 'false'}
      onClick={e => {
        if (!ext) {
          e.preventDefault()
          router.navigate(path)
        }
      }}
    >
      {children}
    </a>
  )
}
