export const saveProducts = ({ name, size, type }) => fetch('/products',
  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, size, type }) })

export default {
  saveProducts,
}