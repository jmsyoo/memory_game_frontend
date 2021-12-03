import React from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import UserInput from './hooks/useInput'
import { v4 as uuidV4 } from 'uuid'



const Login = ({ URL, setUserId }) => {

    const { value: userIdValue, bind: userIdBind, reset: userIdReset } = UserInput('') // Custom userInput hook.
    const postUserId = async (name) => { // save user name to db for tracking number of matched cards and scores.
        try{
            const response = await axios.post(`${URL.production}users`,{
                name:name
            }).then((result) => {
                console.log('users data: ',result.data)
            })
        }catch(error){
            console.error(error)
        }
    }

    const handleIdSubmit = () => {
        setUserId(userIdValue) // store id to localstorage
        userIdReset() // reset input state
        postUserId(userIdValue) // post id to db
    }

    const createNewUserId = () => {
        const name = uuidV4() // useing uuid to create random id for users.
        setUserId(name) // save created user name to userId state which will be displayed on top left body.
        postUserId(name) // post created random user id to db
    }

    return (
        <Form className="Login" onSubmit={handleIdSubmit}>
            <Form.Group>
                <Form.Label>Enter Your Id</Form.Label>
                <Form.Control type="text" required {...userIdBind} placeholder="Enter Id"/>
            </Form.Group>
            <Button type="submit">Login</Button>
            <Button variant="secondary" onClick={createNewUserId}>Create A New Random Id</Button>
        </Form>
    )
}
export default Login
