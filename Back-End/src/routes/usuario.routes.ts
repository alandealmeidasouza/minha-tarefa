import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/usuarios", async (req, res) => {
    try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
    return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios",
    });
}

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email,
        },
    });

    if (usuarioExistente) {
    return res.status(409).json({
        mensagem: "Email já cadastrado",
    }); 
}

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash,
        },
});
    res.status(201).json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
        mensagem: "Erro interno do servidor",
    });
 }
});

router.post("/login", async (req, res) => {
   try {
    const { email, senha } = req.body;

    if (!email || !senha) {
    return res.status(400).json({
        mensagem: "Email e senha são obrigatórios",
    });
    }

    const usuario = await prisma.usuario.findUnique({
    where: {
        email,
    },
    });

    if (!usuario) {
    return res.status(401).json({
        mensagem: "Email ou senha inválidos",
    });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha); // recebe True ou false.

    if (!senhaCorreta) {
    return res.status(401).json({
        mensagem: "Email ou senha inválidos",
    });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
    return res.status(500).json({
        mensagem: "JWT_SECRET não configurada",
    });
  };

   const token = jwt.sign(
    { usuarioId: usuario.id },
    jwtSecret,
    { expiresIn: "1h" }
    );

    return res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        usuario: {
        id: usuario.id,
        nome: usuario.nome
    }
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
        mensagem: "Erro interno do servidor",
    });
  }
});

export default router;