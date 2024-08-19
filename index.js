const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const cors = require('cors')
require('dotenv').config()
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
})
const Aluno = sequelize.define('Aluno', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aluno_matricula: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    turma: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genero: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: false
    },
    aluno_status: {
      type: DataTypes.ENUM('efetivo', 'desligado'),
      allowNull: false
    }
  }, {
    timestamps: false
  })
// Rotas
const app = express()
app.use(express.json())
app.use(cors())

app.post('/aluno', async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body)
    res.status(201).json(aluno)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao criar aluno.' })
  }
})

//rota para listar alunos
app.get('/aluno', async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      attributes: ['id', 'nome', 'aluno_matricula', 'turma', 'genero', 'aluno_status']
    });
    res.json(alunos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao buscar alunos.' })
  }
})

// Rota para atualizar um aluno existente
app.put('/aluno/:id', async (req, res) => {
  const alunoId = req.params.id;
  try {
    // Busca o aluno pelo ID
    let aluno = await Aluno.findByPk(alunoId);
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado.' })
    }
    // Atualiza os dados do aluno com os novos dados do corpo da requisição
    aluno = await aluno.update(req.body)
    // Retorna o aluno atualizado
    res.json(aluno)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar aluno.' })
  }
})

//rota para excluir
  app.delete('/aluno/:id', async (req, res) => {
    const alunoId = req.params.id
    try {
      const aluno = await Aluno.findByPk(alunoId)
      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado.' })
      }
      await aluno.destroy()
      res.json({ message: 'Aluno deletado com sucesso.' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Erro ao deletar aluno.' })
    }
  })

  
const port = process.env.PORT || 3000;
// Verifica se app está definido corretamente
if (typeof app.listen !== 'function') {
  console.error("Erro: 'app' não está definido corretamente.")
} else {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
  })
}
// Sincronizando os modelos com o banco de dados
(async () => {
  try {
    await sequelize.sync()
    console.log('Modelos sincronizados com o banco de dados.')
  } catch (error) {
    console.error('Erro ao sincronizar modelos com o banco de dados:', error)
  }
})()