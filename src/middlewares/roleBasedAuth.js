const roleBasedAuth = (role)=> (req, res, next)=>{

    const userRoles = req.user?.role ?? req.user?.roles;
    const hasRole = Array.isArray(userRoles)
        ? userRoles.includes(role)
        : userRoles === role;

    if(hasRole) return next();

    res.status(403).send("Access denied.");

}


export default roleBasedAuth;  

