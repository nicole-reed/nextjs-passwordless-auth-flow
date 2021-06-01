import connectDB from '../../middleware/mongodb'
import jwt from 'jsonwebtoken'


const handler = async (req, res) => {

    if (req.method === 'POST') {
        try {
            const { authorization } = req.headers


            if (!authorization) {
                throw new Error('forbidden')
            }

            const decodedJwt = jwt.verify(authorization, process.env.SECRET)
            console.log(decodedJwt, 'decoded jwt')

            res.send('success')
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message)
        }

    } else {
        res.status(400).send(`no endpoint ${req.method} /signup`)
    }
}

export default connectDB(handler)