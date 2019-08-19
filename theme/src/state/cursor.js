import React, { createContext, useContext, useReducer } from 'react'

const initialState = { hover: false }

const reducer = (state, action) => {
  switch (action) {
    case 'hover':
      return { hover: true }
    case 'normal':
      return { hover: false }
    default:
      return initialState
  }
}

const CursorStateContext = createContext()
const CursorDispatchContext = createContext()

export const CursorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <CursorDispatchContext.Provider
      value={{
        hover: () => dispatch('hover'),
        normal: () => dispatch('normal'),
      }}
    >
      <CursorStateContext.Provider
        value={{
          state,
        }}
      >
        {children}
      </CursorStateContext.Provider>
    </CursorDispatchContext.Provider>
  )
}

export const useCursorState = () => {
  return useContext(CursorStateContext)
}

export const useCursorDispatch = () => {
  return useContext(CursorDispatchContext)
}
