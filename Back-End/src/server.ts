import express from "express";
import cors from "cors";
import tarefaRoutes from "./routes/tarefa.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(tarefaRoutes);
app.use(usuarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});