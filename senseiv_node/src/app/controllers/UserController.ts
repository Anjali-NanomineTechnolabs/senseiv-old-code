import {FastifyReply, FastifyRequest} from "fastify";
import User from "../models/User";
import {adminEmail, isDate, isEmail, jsonResponse, now} from "../helpers/helpers";
import {CreateUserRequest, UpdateUserRequest} from "../../types/requests/user";
import {Op} from "sequelize";

const bcrypt = require('bcrypt')

class UserController {
    static async getAll(req: FastifyRequest, res: FastifyReply) {
        const users = await User.findAll({
            where: {email: {[Op.ne]: adminEmail}},
            attributes: ['id', 'name', 'email', 'isActive'],
            order: [['id', 'DESC']]
        })

        return jsonResponse(users)
    }

    static async create({body}: CreateUserRequest, res: FastifyReply) {
        if (!body.name) {
            return jsonResponse({}, false, 'name is required')
        }

        if (!body.email || !isEmail(body.email)) {
            return jsonResponse({}, false, 'email is required')
        } else if (await User.findOne({where: {email: body.email}})) {
            return jsonResponse({}, false, 'email already exists')
        }

        if (!body.password || body.password.length < 6) {
            return jsonResponse({}, false, 'password is invalid')
        }

        if (!body.isActive || !['true', 'false'].includes(body.isActive)) {
            return jsonResponse({}, false, 'is active field is required')
        }
        if (!body.expiresAt || !isDate(body.expiresAt)) {
            return jsonResponse({}, false, 'Expiry date is required')
        }

        const user = await User.create({
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            isActive: body.isActive === 'true',
            expiresAt: new Date(now(body.expiresAt)),
        })

        return jsonResponse({id: user.id, name: user.name, email: user.email, isActive: user.isActive, expiresAt: user.expiresAt})
    }

    static async getOne(req: UpdateUserRequest, res: FastifyReply) {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return jsonResponse({}, false, 'User not found')
        }

        if (user.email === adminEmail) {
            return jsonResponse({}, false, 'Cannot update admin user')
        }

        return jsonResponse(user)
    }

    static async update(req: UpdateUserRequest, res: FastifyReply) {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return jsonResponse({}, false, 'User not found')
        }

        if (user.email === adminEmail) {
            return jsonResponse({}, false, 'Cannot update admin user')
        }

        if (req.body.name) {
            user.name = req.body.name
        }

        if (req.body.email) {
            if (!isEmail(req.body.email)) {
                return jsonResponse({}, false, 'Email is invalid')
            } else if (await User.findOne({where: {email: req.body.email, id: {[Op.ne]: user.id}}})) {
                return jsonResponse({}, false, 'Email already exists')
            }

            user.email = req.body.email
        }

        if (req.body.password) {
            if (req.body.password.length < 6) {
                return jsonResponse({}, false, 'Password is invalid')
            }

            user.password = await bcrypt.hash(req.body.password, 10)
        }

        if (req.body.isActive) {
            if (!['true', 'false'].includes(req.body.isActive)) {
                return jsonResponse({}, false, 'Is active field is required')
            }

            user.isActive = req.body.isActive === 'true'
        }

        if (req.body.expiresAt) {
            if (!isDate(req.body.expiresAt)) {
                return jsonResponse({}, false, 'Expiry date is required')
            }

            user.expiresAt = new Date(req.body.expiresAt)
        }

        await user.save()

        return jsonResponse({id: user.id, name: user.name, email: user.email, isActive: user.isActive, expiresAt: user.expiresAt})
    }

    static async delete(req: UpdateUserRequest, res: FastifyReply) {
        const user = await User.findByPk(req.params.id)

        if (!user) {
            return jsonResponse({}, false, 'User not found')
        }

        if (user.email === adminEmail) {
            return jsonResponse({}, false, 'Cannot delete admin user')
        }

        await user.destroy()

        return jsonResponse({}, true, 'User deleted successfully')
    }
}

export default UserController