import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    usuarioId?: string;
}

interface TokenPayload {
    usuarioId: string;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
    return res.status(401).json({
        mensagem: "Token não informado",
    });
  }
   const [tipo, token] = authHeader.split(" ");

   if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
        mensagem: "Token inválido",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({
        mensagem: "JWT_SECRET não configurada",
    });
  }

  try {
    
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    req.usuarioId = decoded.usuarioId;
    next();

} catch {
    return res.status(401).json({
        mensagem: "Token inválido ou expirado",
    });
}
}