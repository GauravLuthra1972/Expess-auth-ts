import { Router } from "express";
import taskController from "../controllers/taskController";

const router=Router()
const tasks=new taskController()

router.get("/:user_id", tasks.fetchTasks);
export default router