    export default function sessionAuth(req, res, next) {
        const user = req.session.user;
        console.log(user)
        if(!user) {
            return res.status(401).json({message: 'Please log in'})
        }

        if(user.is_blocked) {
            return res.status(403).json({ message: 'Your account is blocked' });
        }

        next()
    };
 
    