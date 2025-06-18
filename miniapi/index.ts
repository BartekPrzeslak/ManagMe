import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import cors from 'cors'

const MOCK_USERS = [
  { id: '1', login: 'admin', password: 'admin123', firstName: 'Jan', lastName: 'Admin', role: 'admin' },
  { id: '2', login: 'dev', password: 'dev123', firstName: 'Natalia', lastName: 'Nowak', role: 'devops' },
  { id: '3', login: 'dev2', password: 'dev2123', firstName: 'Czeslaw', lastName: 'Brzytwa', role: 'developer' }
];

const app = express()
const port = 3000

const tokenSecret = process.env.TOKEN_SECRET as string
let refreshToken: string

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World - simple api with JWT!')
})

app.post(
  "/token",
  function (req, res) {
    const expTime = req.body.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    res.status(200).send({ token, refreshToken })
  }
)
app.post(
  "/refreshToken",
  function (req, res) {
    const refreshTokenFromPost = req.body.refreshToken
    if (refreshToken !== refreshTokenFromPost) {
      res.status(400).send('Bad refresh token!')
    }
    const expTime = req.headers.exp || 60
    const token = generateToken(+expTime)
    refreshToken = generateToken(60 * 60)
    setTimeout(() => {
      res.status(200).send({ token, refreshToken })
    }, 3000)
  }
)

app.post('/login', (req, res) => {
  const { login, password } = req.body;
  const user = MOCK_USERS.find(u => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).send({ error: "Invalid credentials" });
  }
  const token = generateToken(60 * 15); // 15 min
  refreshToken = generateToken(60 * 60); // 60 min
  const { password: _, ...userWithoutPassword } = user;
  res.send({ token, refreshToken, user: userWithoutPassword });
});

app.get('/me', verifyToken, (req, res) => {
  // zwraca 1 asera admin 
  const user = MOCK_USERS[0];
  const { password: _, ...userWithoutPassword } = user;
  res.send(userWithoutPassword);
});

app.get(
  "/protected/:id/:delay?",
  verifyToken,
  (req, res) => {
    const id = req.params.id
    const delay = req.params.delay ? +req.params.delay : 1000
    setTimeout(() => {
      res.status(200).send(`{"message": "protected endpoint ${id}"}`)
    }, delay)
  }
)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function generateToken(expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
  const token = jwt.sign({ exp, foo: 'bar' }, tokenSecret, { algorithm: 'HS256' })
  return token
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.sendStatus(403)

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err)
      return res.status(401).send(err.message)
    }
    req.user = user
    next()
  })
}