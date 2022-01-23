import { Button, InputLabel, Select, TextField } from '@material-ui/core'
import { useState } from 'react'
import { saveProducts } from '../services/productServices'
import HTTP_STATUS from '../consts/httpStatus'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

export const Formulario = () => {
  const [formErrors, setFormErrors]       = useState({
    name: '',
    size: '',
    type: '',
  })
  const [isSaving, setIsSaving]           = useState(false)
  const [isSuccess, setIsSuccess]         = useState(false)
  const [errorMessages, setErrorMessages] = useState('')

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

  const getFormValues = ({ name, size, type }) => ({ name: name.value, size: size.value, type: type.value })

  const handleFetchErrors = async (e) => {
    if (e.status === HTTP_STATUS.ERROR_SEVER_STATUS) {
      setErrorMessages('Unexpected error, please try again')
      return
    }

    if (e.status === HTTP_STATUS.INVALID_REQUEST_STATUS) {
      const data = await e.json()
      setErrorMessages(data.message)
      return
    }
    setErrorMessages('Connection error, please try again')
  }

  const sendError = (response) => {
    if (!response.ok) {
      throw response;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    const { name, size, type } = event.target.elements
    validateForm(getFormValues({ name, size, type }))
    try {
      const response = await saveProducts(getFormValues({ name, size, type }))
      sendError(response)
      if (response.status === HTTP_STATUS.CREATED_STATUS) {
        event.target.reset()
        setIsSuccess(true)
      }
    } catch (e) {
      await handleFetchErrors(e)
    }
    setIsSaving(false)
  }

  const handleBlur = (event) => {
    const { name, value } = event.target
    validateField(name, value)
  }
  return (
    <Container maxWidth="xs">
      <CssBaseline/>
      <Typography component="h1" valriant="h5" align="center">Create product</Typography>
      {isSuccess && <p>Product Stored</p>}
      {errorMessages && <p>{errorMessages}</p>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="name"
              id="name"
              helperText={formErrors.name}
              onBlur={handleBlur}
              name="name"
              error={!!formErrors.name.length}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="size"
              id="size"
              helperText={formErrors.size}
              name="size"
              error={!!formErrors.size.length}
              onBlur={handleBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="type">
              Type
            </InputLabel>
            <Select
              fullWidth
              native
              inputProps={{
                name: 'type',
                id: 'type',
              }}
              error={!!formErrors.type.length}
            >
              <option aria-label="None" value=""/>
              <option value="electronic">Electronic</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
            </Select>
            {!!formErrors.type && <p>{formErrors.type}</p>}
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth type="submit" disabled={isSaving}>Submit</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}