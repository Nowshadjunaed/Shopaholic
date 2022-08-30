import bcrypt from "bcryptjs";

const users = [
  {
    name: "Ecom-admin",
    email: "admin@gmail.com",
    account_number: "111423192491172311192292132523",
    password: bcrypt.hashSync("password", 10),
    isAdmin: true,
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
