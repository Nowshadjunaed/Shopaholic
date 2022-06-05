import bcrypt from 'bcryptjs'

const users = [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('password', 10),
      isAdmin: true,
    },
    {
      name: 'Junaed',
      email: 'junaed@gmail.com',
      password: bcrypt.hashSync('password', 10),
    },
    {
      name: 'Omar',
      email: 'Omar@gmail.com',
      password: bcrypt.hashSync('password', 10),
    },
  ]
  
  export default users