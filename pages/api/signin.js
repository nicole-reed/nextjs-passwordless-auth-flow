import { User } from '../../models/User'
import connectDB from '../../middleware/mongodb'
import { randomDigits } from 'crypto-secure-random-digit'
import { sendEmail } from '../../server/sendEmail'
import { BadRequestError } from '../../errors/badRequest.error'
import { NotFoundError } from '../../errors/notFound.error'


const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const email = req.body.email

            if (!email) {
                throw new BadRequestError('email is required')
            }

            const user = await User.findOne({ email })

            if (!user) {
                throw new NotFoundError('user does not exist')
            }

            const loginCode = randomDigits(6).join('')
            const loginCodeCreatedAt = new Date()


            await user.updateOne({ loginCode, loginCodeCreatedAt, loginCodeAttempts: 0 })

            await sendEmail(email, loginCode)
            res.send('please check your email for login code')
        } catch (error) {
            res.status(error.statussCode || 500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /signup`)
    }
}

export default connectDB(handler)