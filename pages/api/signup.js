import { User } from '../../models/User'
import connectDB from '../../middleware/mongodb'
import { BadRequestError } from '../../errors/badRequest.error'


const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const email = req.body.email

            if (!email) {
                throw new BadRequestError('email is required')
            }

            const existingUser = await User.findOne({ email })

            if (existingUser) {
                throw new BadRequestError('user already exists')
            }

            const user = new User({ email })

            await user.save()

            res.send(`user ${email} saved`)

        } catch (error) {
            res.status(error.statusCode || 500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /signup`)
    }
}

export default connectDB(handler)