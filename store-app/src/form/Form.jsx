import { Button, InputLabel, Select, TextField } from '@material-ui/core'
import { useState } from 'react'
import { saveProducts } from '../services/productServices'
import HTTP_STATUS from '../consts/httpStatus'

export const Form = () => {
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: '',
  })
  const [isSaving, setIsSaving]     = useState(false)
  const [isSuccess, setIsSuccess]   = useState(false)

  const validateField = (name, value) => {
    setFormErrors({
      ...formErrors,
      [name]: value.length ? '' : `The ${name} is required`,
    })
  }

  const validateForm = ({ name, size, type }) => {
    validateField('name', name)
    validateField('size', size)
    validateField('type', type)
  }

  const getFormValues = ({name, size, type}) => ({ name: name.value, size: size.value, type: type.value })

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSaving(true)
    const { name, size, type } = event.target.elements

    validateForm(getFormValues({name, size, type}))

    const response = await saveProducts(getFormValues({name, size, type}))

    if (response.status === HTTP_STATUS.CREATED_STATUS) {
      setIsSuccess(true)
    }
    setIsSaving(false)
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    validateField(name, value)
  }
  return (
    <>
      <h1>Create product</h1>
      {isSuccess && <p>Product Stored</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          id="name"
          helperText={formErrors.name}
          onBlur={handleBlur}
          name="name"
        />
        <TextField
          label="size"
          id="size"
          helperText={formErrors.size}
          name="size"
          onBlur={handleBlur}
        />
        <InputLabel variant="standard" htmlFor="type">
          Type
        </InputLabel>
        <Select
          native
          inputProps={{
            name: 'type',
            id: 'type',
          }}
          onBlur={handleBlur}
        >
          <option aria-label="None" value=""/>
          <option value="electronic">Electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select>
        {formErrors.type.length && <p>{formErrors.type}</p>}
        <Button type="submit" disabled={isSaving}>Submit</Button>
      </form>
    </>
  )
}