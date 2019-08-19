import React from 'react'
import Layout from './src/components/Layout'
import { CursorProvider } from './src/state/cursor'

export const wrapPageElement = ({ element, props }, pluginOptions) => {
  const { transitions = true } = pluginOptions
  const { customCursor = false } = pluginOptions
  return (
    <CursorProvider>
      <Layout {...props} transitions={transitions} cursor={customCursor}>
        {element}
      </Layout>
    </CursorProvider>
  )
}

export const shouldUpdateScroll = (
  { routerProps: { location }, getSavedScrollPosition },
  pluginOptions
) => {
  const { transitions = true } = pluginOptions

  if (location.action === 'PUSH') {
    window.setTimeout(() => window.scrollTo(0, 0), transitions ? 350 : 0)
  } else {
    const savedPosition = getSavedScrollPosition(location)
    window.setTimeout(
      () => window.scrollTo(...(savedPosition || [0, 0])),
      transitions ? 350 : 0
    )
  }
  return false
}

export const onRouteUpdate = () => {
  const links = document.getElementsByTagName('a')
  const buttons = document.getElementsByTagName('button')
  const hoverItems = [...links, ...buttons]

  const hoverState = () => {
    console.log('hover')
  }
  const defaultState = () => {
    console.log('normal')
  }
  for (let i = 0; i < hoverItems.length; i++) {
    hoverItems[i].onmouseover = hoverState
    hoverItems[i].onmouseout = defaultState
  }
}
