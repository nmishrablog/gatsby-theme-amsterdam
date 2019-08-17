import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

/*
  This is pretty much a direct port of the simple example
  created by Max Yinger from the article he wrote called
  Input Smoother: An Intro To Reactive Animations.

  https://formidable.com/blog/2019/input-smoothing/
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
`

const Cursor = styled.div`
  position: absolute;
  background-blend-mode: multiply;
  border: 2px solid ${props => props.theme.colors.base};
  border-radius: 99999px;
  height: 50px;
  width: 50px;
  opacity: 0.25;
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

const FollowCursor = () => {
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

  useEffect(() => () => smoothedMouse.stop(), [])

  useEffect(() => {
    window.addEventListener('mousemove', updateCursorPosition, {
      passive: true,
    })
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition, {
        passive: true,
      })
    }
  }, [])

  return (
    <Wrapper>
      <Cursor
        style={{
          transform: `translate(calc( calc(${x}, 0) * 1px - 50%),calc(calc(${y}, 0) * 1px - 50%))`,
        }}
      />
    </Wrapper>
  )
}

export default FollowCursor
