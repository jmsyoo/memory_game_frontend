import { useState, useEffect } from 'react'

const PREFIX = 'memory-game-' // In order to distinguish among all the apps using local storage.

export default function useLocalStorage(key, initialValue){
    const prefixedKey = PREFIX + key

    const [value, setValue] = useState(() => {
        const jsonValue = localStorage.getItem(prefixedKey) // This will get the value.

        if(jsonValue !== undefined && jsonValue !== null){ // if initial value is not undefined and not null then parse it with json value and return
            return JSON.parse(jsonValue)
        }
        if(typeof initialValue === 'function'){ // if initial value is funtion then just return initial value
            return initialValue
        }else{ // otherwise just return initialvalue
            return initialValue
        }
    })

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value)) // every time prefixed key or value is changed 
    },[prefixedKey, value])                                      //parse the value to json and store key and value to local storage.

    return [value, setValue]
}