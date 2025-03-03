const users = [
    {
        email : "malav@gmail.com",
        password : "password"
    },
    {
        email : "ayush@gmail.com",
        password : "password"
    },
    {
        email : "mayur@gmail.com",
        password : "password"
    },
]

export const getUserByEmail = email =>{
    const found = users.find(user => user.email ===  email);
    return found;
}