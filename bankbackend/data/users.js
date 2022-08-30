import bcrypt from "bcryptjs";
// a = 11 to z = 36
// A = 41 to Z = 66
// @ = 91, . = 92, _ = 93

const users = [
  {
    name: "Ecom-admin",
    email: "admin@gmail.com",
    account_number: "111423192491172311192292132523",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Nowshad Junaed",
    email: "junaed@gmail.com",
    account_number: "20312411151491172311192292132523",
    password: bcrypt.hashSync("password", 10),
  },
  {
    name: "Omar Faruqe",
    email: "riyad.omf@gmail.com",
    account_number: "28193511149225231691172311192292132523",
    password: bcrypt.hashSync("password", 10),
  },
];

export default users;
