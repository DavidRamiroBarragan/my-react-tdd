export const login = () => {
  return fetch('/login', { method: 'POST' })
}