import { Request, Response, NextFunction } from "express";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const secret = process.env.SECRET_KEY;
    if (!secret) return res.status(500).json({ message: "Server configuration error" });

    try {
        // const decoded = jwt.verify(token, secret);
        // (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
