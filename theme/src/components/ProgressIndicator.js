import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { motion, useViewportScroll } from 'framer-motion'

/*
  Heavily inspired by the following:
  - https://formidable.com/blog/2019/input-smoothing/
  - https://alfacharlie.co/
*/

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999999;
  pointer-events: none;
  @media (hover: none) {
    display: none !important;
  }
  &.hover {
    svg {
      opacity: 0;
    }
  }
`

const SVG = styled.svg`
  opacity: 0;
  transition: 0.5s opacity;
  position: absolute;
  height: 48px;
  width: 48px;
  overflow: hidden;
  #progress {
    stroke: ${props => props.theme.colors.highlight};
  }
  #outline {
    stroke: ${props => props.theme.colors.border};
  }
`

/**
 * Scan
 */
const scan = (reducer, init) => {
  const state = {
    accumulator: init,
    reducer: reducer,
    listener: () => {},
  }

  const next = v => {
    state.accumulator = reducer(state.accumulator, v)
    state.listener(state.accumulator)
  }

  const start = listener => {
    state.listener = listener

    return { next }
  }

  return { start }
}

/**
 * Lerp
 */
const lerp = roundness => (accum, target) => {
  return Object.keys(accum).reduce((acc, key) => {
    acc[key] = (1 - roundness) * accum[key] + target[key] * roundness
    return acc
  }, {})
}

/**
 * rAF
 */
const rAF = () => {
  const state = {
    listener: () => {},
    animationFrameId: null,
  }

  const loop = timeStamp => {
    state.listener(timeStamp)
    state.animationFrameId = requestAnimationFrame(timeStamp => {
      loop(timeStamp)
    })
  }

  const stop = () => {
    cancelAnimationFrame(state.animationFrameId)
  }

  const start = listener => {
    state.listener = listener
    loop(Date.now())

    return { stop }
  }

  return { start }
}

/**
 * Smooth
 */
const smooth = (init, { roundness = 0.1 } = {}) => {
  const state = {
    scan: null,
    loop: null,
    target: init,
  }

  const update = v => {
    state.target = v
  }

  const stop = () => {
    state.raf.stop()
  }

  const start = listener => {
    state.scan = scan(lerp(roundness), init).start(listener)

    state.loop = rAF().start(() => {
      state.scan.next(state.target)
    })

    return { update, stop }
  }

  return { start }
}

const ProgressIndicator = () => {
  const { scrollYProgress } = useViewportScroll()

  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const smoothedMouse = useMemo(() => {
    return smooth({ x: 0, y: 0 }).start(({ x, y }) => {
      setX(x)
      setY(y)
    })
  }, [])

  const updateCursorPosition = e => {
    smoothedMouse.update({
      x: e.clientX,
      y: e.clientY,
    })
  }

  useEffect(() => {
    window.addEventListener('mousemove', updateCursorPosition, {
      passive: true,
    })
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition, {
        passive: true,
      })
      smoothedMouse.stop()
    }
  }, [])

  return (
    <Wrapper>
      <SVG
        style={{
          transform: `translate(calc( calc(${x}, 0) * 1px - 50%),calc(calc(${y}, 0) * 1px - 50%))`,
        }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 36 36"
        xmlSpace="preserve"
        id="cursor"
      >
        <path
          id="outline"
          fill="none"
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <motion.path
          fill="none"
          id="progress"
          style={{ pathLength: scrollYProgress }}
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </SVG>
    </Wrapper>
  )
}

export default ProgressIndicator
