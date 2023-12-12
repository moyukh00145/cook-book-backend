const status={
  msg:"",
  done: false
}

const userExists = {
  ...status,
  ["msg"]: "User already exists"
}
const userCreated = {
  ...status,
  ["msg"]: "User created successfully",
  ["done"]: true
}

const sessonExpired={
  msg: "Your sesson has expired! Please Login",
  done: false
}

const successfullyLogin = {
  msg: "Successfully logged in",
  done: true
}

const wrongCredentials = {
  msg: "Your provided credentials are incorrect",
  done: false
}
const invalidCredentials = {
  msg: "Please provide a valid credentials",
  done: false
}

module.exports = {
  status, 
  userExists ,
  userCreated,
  sessonExpired,
  successfullyLogin,
  wrongCredentials,
  invalidCredentials
}