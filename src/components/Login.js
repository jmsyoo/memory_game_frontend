import React, { useState } from 'react'
import axios from 'axios'
import { Form, Button } from 'react-bootstrap'
import UserInput from './hooks/useInput'
import { v4 as uuidV4 } from 'uuid'

const Login = ({ URL, setUserId }) => {

    const { value: userNameValue, bind: userIdBind, reset: userIdReset } = UserInput('') // Custom userInput hook.

    // Save if it's new user. otherwise find user id for saving play records.
    /*
     * Using stored procedure would be much easier and cleaner than using get and post route with callback.
     * Checking results in procedure, if result is not null than return list otherwise insert param value into user table.
     */
    const saveNewUserDataToDb = async (name) => {
        try{
            const response = await axios.post(`${URL.production}users`, {
                name: name,
              }).then((result) => {
                console.log("save users data: ", result.data);
                setUserId(name + "%%" + result.data.id + '%%' + '0'); // Save name and user id to localstorage.
              });
        }catch(error){
            console.error(error)
        }
    }
    const getUserData = async (name, cb) => { // save user name to db for tracking number of matched cards and scores.
        try{
            const response = await axios.get(`${URL.production}users/${name}`).then((result) => {         
                console.log('fetched users data: ',result.data)
                if(result.data){
                    setUserId(name + '%%' + result.data.id + '%%' + '1') // Save name and user id to localstorage.
                }
                else{
                    cb(name) // If user name is not found then save to db.
                }            
            })
        }catch(error){
            console.error(error)
        }finally{
            userIdReset() // user input value set to default.
        }
    }

    const handleIdSubmit = () => {
        getUserData(userNameValue, saveNewUserDataToDb) // save user name to db
        setUserId(userNameValue) // store id to localstorage
    }

    const createNewUserId = () => {
        const name = uuidV4() // useing uuid to create random id for users.
        getUserData(name, saveNewUserDataToDb) // save created random user name to db
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
