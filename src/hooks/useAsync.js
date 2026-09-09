import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Runs an async fetcher, tracking loading / error / data state.
 * Re-runs whenever `deps` changes. Exposes `reload` for manual retry.
 */
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const requestId = useRef(0)

  const load = useCallback(() => {
    const id = ++requestId.current
    setState((s) => ({ ...s, status: 'loading', error: null }))
    fetcher()
      .then((data) => {
        if (requestId.current === id) setState({ status: 'success', data, error: null })
      })
      .catch((error) => {
        if (requestId.current === id) setState({ status: 'error', data: null, error })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
  }, [load])

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    reload: load,
  }
}
