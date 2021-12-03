import { useState } from 'react'

const UserInput = initialValue => {
    const [value, setValue] = useState(initialValue)

    return {
        value,
        setValue,
        reset: () => setValue(''),
        bind: {
            value,
            onChange: evt => {
                setValue(evt.target.value)
            }
        }
    }
}

export default UserInput