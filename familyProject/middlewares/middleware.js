import jwt from 'jsonwebtoken';




const isAuth = async (req, res, next) => {
    try {

        const { authorization } = req.headers;

        console.log("authorization = " + authorization);
        if (!authorization) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }
        const [, token] = authorization.split(' ');
        console.log("token in mid" + token);

        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
        console.log("privte key" + privateKey);
        // const data = jwt.verify(token, privateKey);
        // console.log("data in middleware" + user)
        try {
            const data = jwt.verify(token, privateKey);
            req.user = data;
            next();
        } catch (err) {
            console.error('Token verification failed:', err);
            next({ message: 'Unauthorized access - Token is invalid or expired', status: 401 });
        }

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

const isAdmin = (req, res, next) => {
    console.log("manager? "+ req.user.isManager)
    if (req.user.isManager) {
        next(); 
    } else {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
}


export { isAuth, isAdmin };
