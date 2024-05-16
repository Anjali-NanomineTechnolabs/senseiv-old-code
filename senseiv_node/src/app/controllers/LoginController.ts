import {FastifyReply} from "fastify";
import {LoginRequest} from "../../types/requests/login";
import {jsonResponse, now} from "../helpers/helpers";
import User from "../models/User";
import {sign as jwtSign} from "jsonwebtoken";

const bcrypt = require('bcrypt')

class LoginController {
    static async login(request: LoginRequest, response: FastifyReply) {
        if (!request.body.email) {
            return jsonResponse({}, false, 'Email is required')
        }

        if (!request.body.password) {
            return jsonResponse({}, false, 'Password is required')
        }

        const user = await User.findOne({where: {email: request.body.email}})
        if (!user) {
            return jsonResponse({}, false, 'Email does not exists')
        }

        if (user.isLoggedIn) {
            return jsonResponse({}, false, 'User is already logged in')
        }

        const match = await bcrypt.compare(request.body.password, user.password)
        if (!match) {
            return jsonResponse({}, false, 'Password is incorrect')
        }

        if (!user.isActive) {
            return jsonResponse({}, false, 'User is not active')
        }

        if (now(user.expiresAt) < now()) {
            return jsonResponse({}, false, 'User is expired')
        }

        // create new token
        const token = jwtSign(user.toJSON(), process.env.JWT_SECRET || '')

        // mark the user loggedIn
        await User.update({isLoggedIn: true, token}, {where: {id: user.id}})

        return jsonResponse({
            token, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                expiresAt: user.expiresAt,
                isAdmin: user.email === process.env.ADMIN_EMAIL
            }
        })
    }

    static async logout(request: LoginRequest, response: FastifyReply) {
        console.log(request.user)
        const user = request.user
        if (!user) {
            return jsonResponse({}, false, 'User not found')
        }

        user.isLoggedIn = false
        user.token = null
        user.save()

        return jsonResponse({}, true, 'User logged out')
    }

    static verifyToken(request: LoginRequest, response: FastifyReply) {
        const user = request.user
        if (!user) {
            return jsonResponse({}, false, 'User not found')
        }

        return jsonResponse({}, true, 'Success')

    }
}

export default LoginController