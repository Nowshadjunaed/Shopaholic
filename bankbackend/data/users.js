import bcrypt from 'bcryptjs'
// a = 11 to z = 36
// A = 41 to Z = 66
// @ = 91, . = 92, _ = 93
const users = [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      account_number: '111423192491172311192292132513',
      password: bcrypt.hashSync('password', 10),
      
    },
    {
      name: 'Junaed',
      email: 'junaed@gmail.com',
      account_number: '20312411151491172311192292132513',
      password: bcrypt.hashSync('password', 10),
    },
    {
      name: 'Omar',
      email: 'Omar@gmail.com',
      account_number: '2523112891172311192292132513',
      password: bcrypt.hashSync('password', 10),
    },
  ]
  
  export default users