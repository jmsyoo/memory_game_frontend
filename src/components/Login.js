import React from 'react'
import { Form, Button } from 'react-bootstrap'

const Login = () => {
    return (
        <Form className="Login">
            <Form.Group>
                <Form.Label>Enter Your Id</Form.Label>
                <Form.Control type="text" required />
            </Form.Group>
            <Button type="submit">Login</Button>
            <Button variant="secondary" >Create A New Id</Button>
        </Form>
    )
}
export default Login
