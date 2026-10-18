import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadData, saveData, clearData } from './persist'
import { SCHEMA_VERSION, emptyDb } from './model'

const StoreContext = createContext(null)
const SESSION_KEY = 'olympia-pdv-user'

function migrate(data) {
  // Garante que chaves novas existam em bancos criados por versões anteriores.
  const base = emptyDb()
  const merged = { ...base, ...data, settings: { ...base.settings, ...(data.settings || {}) } }
  merged.version = SCHEMA_VERSION
  return merged
}

export function StoreProvider({ children }) {
  const [db, setDb] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) } catch { return null }
  })
  const [toasts, setToasts] = useState([])
  const saveTimer = useRef(null)
  const dbRef = useRef(null)

  useEffect(() => {
    loadData().then((data) => {
      const value = data ? migrate(data) : null
      dbRef.current = value
      setDb(value)
      setReady(true)
    })
  }, [])

  const persist = useCallback((value) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveData(value).catch(() => toast('Não foi possível salvar os dados neste navegador.', 'error'))
    }, 150)
  }, [])

  // update(fn): fn recebe um rascunho mutável; retorna o que fn retornar.
  // Lança o erro de fn sem alterar nada.
  const update = useCallback((fn) => {
    const draft = structuredClone(dbRef.current)
    const result = fn(draft)
    dbRef.current = draft
    setDb(draft)
    persist(draft)
    return result
  }, [persist])

  const replaceDb = useCallback((value) => {
    const next = value ? migrate(value) : null
    dbRef.current = next
    setDb(next)
    if (next) persist(next)
    else clearData()
  }, [persist])

  const toast = useCallback((message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const login = useCallback((id) => {
    setUserId(id)
    try { sessionStorage.setItem(SESSION_KEY, id) } catch { /* modo privado */ }
  }, [])
  const logout = useCallback(() => {
    setUserId(null)
    try { sessionStorage.removeItem(SESSION_KEY) } catch { /* modo privado */ }
  }, [])

  const user = useMemo(() => db?.users.find((u) => u.id === userId && u.active) || null, [db, userId])

  const value = useMemo(
    () => ({ db, ready, update, replaceDb, user, login, logout, toast, toasts }),
    [db, ready, update, replaceDb, user, login, logout, toast, toasts],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
