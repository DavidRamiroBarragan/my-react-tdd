import {Button, FormControl, InputLabel, Select, TextField} from '@material-ui/core';
import {useState} from 'react';

export const Form = () => {
    const [formErrors, setFormErrors] = useState({name: '', size: '', type: ''});
    const handleSubmit                = (event) => {
        event.preventDefault();
        const {name, size, type} = event.target.elements;

        if (!name.value) {
            setFormErrors((prev) => ({...prev, name: 'The name is required'}));
        }
        if (!size.value) {
            setFormErrors((prev) => ({...prev, size: 'The size is required'}));
        }
        if (!type.value) {
            setFormErrors((prev) => ({...prev, type: 'The type is required'}));
        }
    };
    return (
        <>
            <h1>Create product</h1>
            <form onSubmit={handleSubmit}>
                <TextField label={'name'} id="name" helperText={formErrors.name}/>
                <TextField label={'size'} id="size" helperText={formErrors.size}/>
                    <InputLabel variant="standard" htmlFor="type">
                        Type
                    </InputLabel>
                    <Select
                        native
                        value=""
                        inputProps={{
                            name: 'type',
                            id: 'type',
                        }}

                    >
                        <option aria-label="None" value="" />
                        <option value="electronic">Electronic</option>
                        <option value="furniture">Furniture</option>
                        <option value="clothing">Clothing</option>
                    </Select>
                    {formErrors.type.length &&<p>{formErrors.type}</p>}
                <Button type="submit">Submit</Button>
            </form>
        </>
    );
};