import {Request,Response} from 'express'
import db from '../config/db'

class taskController{

    async fetchTasks(req:Request,res:Response){
        console.log("running")

        const user_id=req.params.user_id;
        console.log(user_id)

        try{
            if (!user_id) {
                return res.status(400).json({ error: 'userid is required' });
            }

            const tasks=await db.query('Select * from Tasks where user_id=?',[user_id])
            res.json({message:"Success",tasks:tasks})

        }
        catch(err){
            res.status(500).json({ error: 'Failed to fetch tasks',err });
        }


    }

}


export default taskController