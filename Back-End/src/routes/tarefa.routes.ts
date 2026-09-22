import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { auth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/tarefas", auth, async (req: AuthRequest, res) => {
  try {
  const tarefas = await prisma.tarefa.findMany({
    where: {
        usuarioId: req.usuarioId,
    },
});

  res.json(tarefas);

} catch (erro) {
  console.error(erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
}


});

router.post("/tarefas", auth, async (req: AuthRequest, res) => {
  try {
  const { titulo } = req.body;

  if (!titulo) {
  return res.status(400).json({
    mensagem: "Título é obrigatório",
  });
}

  const tarefa = await prisma.tarefa.create({
    data: {
      titulo,
      usuarioId: req.usuarioId!,
    },
  });

  res.status(201).json(tarefa);
 } catch (erro) {
  console.error(erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
 }
});

router.delete("/tarefas/:id", auth, async (req: AuthRequest, res) => {
  try {
  const id = req.params.id as string;

  const tarefa = await prisma.tarefa.findFirst({
    where: {
        id,
        usuarioId: req.usuarioId,
    },
});

  if (!tarefa) {
    return res.status(404).json({
        mensagem: "Tarefa não encontrada",
    });
}

  await prisma.tarefa.delete({
    where: {
      id,
    },
  });

  res.json({
    mensagem: "Tarefa removida com sucesso",
  });
  
} catch (erro) {
  console.error(erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
 }
});

router.put("/tarefas/:id", auth, async (req: AuthRequest, res) => {
  try {
  const id = req.params.id as string;
  const { titulo, concluida } = req.body;

  if (concluida !== undefined && typeof concluida !== "boolean") {
  return res.status(400).json({
    mensagem: "O campo concluida deve ser true ou false",
  });
}

if (titulo !== undefined && !titulo.trim()) {
  return res.status(400).json({
    mensagem: "Título não pode estar vazio",
  });
}

  const tarefaExistente = await prisma.tarefa.findFirst({
    where: {
        id,
        usuarioId: req.usuarioId,
    },
});

  if (!tarefaExistente) {
    return res.status(404).json({
        mensagem: "Tarefa não encontrada",
    });
}

  const tarefa = await prisma.tarefa.update({
    where: {
      id,
    },
    data: {
      titulo,
      concluida,
    },
  });

  res.json(tarefa);

 } catch (erro) {
  console.error(erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor",
  });
 }
});

export default router;