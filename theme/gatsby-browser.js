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

// Detect hover to apply the hover state on the custom cursor
export const onRouteUpdate = ({ location }, pluginOptions) => {
  const { customCursor = false } = pluginOptions
  if (customCursor === true) {
    const links = document.getElementsByTagName('a')
    const buttons = document.getElementsByTagName('button')
    const inputs = document.getElementsByTagName('input')
    const selects = document.getElementsByTagName('select')
    const hoverItems = [...links, ...buttons, ...inputs, ...selects]
    const HoverState = () => {
      const body = document.getElementById('cursor')
      body.classList.add('hover')
    }
    const DefaultState = () => {
      const body = document.getElementById('cursor')
      body.classList.remove('hover')
    }
    DefaultState()
    for (let i = 0; i < hoverItems.length; i++) {
      hoverItems[i].onmouseover = HoverState
      hoverItems[i].onmouseout = DefaultState
    }
  }
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
