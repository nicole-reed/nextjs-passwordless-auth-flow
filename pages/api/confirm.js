import { User } from '../../models/User'
import connectDB from '../../middleware/mongodb'
import jwt from 'jsonwebtoken'
import { NotFoundError } from '../../errors/notFound.error'
import { BadRequestError } from '../../errors/badRequest.error'


const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const { email, loginCode } = req.body

            if (!email) {
                throw new BadRequestError('email is required')
            }

            if (!loginCode) {
                throw new BadRequestError('loginCode is required')
            }

            const user = await User.findOne({ email })

            if (!user) {
                throw new NotFoundError('user does not exist')
            }

            if (user.loginCodeAttempts > 4) {
                throw new BadRequestError('too many attempts. please request new login code.')
            }

            const now = new Date().getTime()
            const codeIssuedAt = new Date(user.loginCodeCreatedAt).getTime()

            if (now - codeIssuedAt > 600000) {
                throw new BadRequestError('code is expired')
            }

            if (user.loginCode !== loginCode) {
                await user.updateOne({ $inc: { loginCodeAttempts: 1 } })

                throw new BadRequestError('incorrect loginCode')
            }

            const token = jwt.sign({ email }, process.env.SECRET)

            res.send({ token })

        } catch (error) {
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /confirm`)
    }
}

export default connectDB(handler)