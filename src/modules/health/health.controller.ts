import { Request, Response } from "express";
import { HealthService } from "./health.service.js";

const healtService = new HealthService()

export function health(req: Request, res: Response) {
    const result = healtService.getHealth()
    
    res.json(result)
}