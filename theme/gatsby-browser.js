import React from 'react'
import Layout from './src/components/Layout'
import { OptionsProvider } from './src/components/OptionsContext'

export const wrapPageElement = ({ element, props }, pluginOptions) => {
  const value = {
    basePath: '/',
    contentPath: '/content',
    transitions: true,
    progressIndicator: false,
    grid: 'basic',
    postsPerPage: 6,
    ...pluginOptions,
  }

  return (
    <OptionsProvider value={value}>
      <Layout {...props}>{element}</Layout>
    </OptionsProvider>
  )
}

const listenForHover = () => {
  const links = document.getElementsByTagName('a')
  const buttons = document.getElementsByTagName('button')
  const inputs = document.getElementsByTagName('input')
  const selects = document.getElementsByTagName('select')
  const hoverItems = [...links, ...buttons, ...inputs, ...selects]
  const body = document.getElementsByTagName('body')[0]
  const HoverState = () => {
    body.classList.add('hidden')
  }
  const DefaultState = () => {
    body.classList.remove('hidden')
  }
  console.log(links)
  for (let i = 0; i < hoverItems.length; i++) {
    hoverItems[i].onmouseover = HoverState
    hoverItems[i].onmouseout = DefaultState
  }
}

// Detect hover to apply the hover state on the custom cursor
export const onRouteUpdate = (_, pluginOptions) => {
  const { progressIndicator = false } = pluginOptions
  if (progressIndicator === true) {
    listenForHover()
  }
}

export const onClientEntry = (_, pluginOptions) => {
  const { progressIndicator = false } = pluginOptions
  if (progressIndicator === true) {
    listenForHover()
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
