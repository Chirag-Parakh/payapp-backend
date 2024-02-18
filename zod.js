const zod = require('zod');

const UserZodSchema = zod.object({
    username: zod.string()
        .min(8, { message: "Username must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "username must contain a lowercase letter" })
        .regex(/[A-Z]/, { message: "username must contain an uppercase letter" })
        .regex(/^\S*$/, {  message: "Username cannot contain spaces"}),
    password: zod.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain a number" })
        .regex(/[!@#$%&*?]/, { message: "Password must contain a special character" })
        .regex(/^\S*$/, {  message: "Username cannot contain spaces"}).optional(),
    email : zod.string().email().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
})

module.exports = UserZodSchema;