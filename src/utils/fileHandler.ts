import fs from 'fs'
import path from 'path'
import { User } from '../models/User'

const path1=path.join(__dirname,"../data/users.json")


function read(): User[] {
    const jsondata = fs.readFileSync(path1, 'utf-8');
    console.log(jsondata);
    const users: User[] = JSON.parse(jsondata);
    return users;
}

function write(users:User[]):void{
    fs.writeFileSync(path1,JSON.stringify(users))

}

export {read,write}