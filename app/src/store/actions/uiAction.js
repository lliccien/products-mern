import { types } from "../types/types"

export const setError = (error) => {
  return {
    type: types.uiSetError,
    payload: error
  }
}

export const clearError = () => {
    return {
        type: types.uiClearError
    }
}

export const startLoading = () => {
    return {
        type: types.uiStartLoading
    }
}

export const endLoading = () => {
    return {
        type: types.uiEndLoading
    }
}