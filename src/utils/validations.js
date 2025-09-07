const validateSignupData = (req) => {
    const { } = req.body
}



const validateProfileData = (req) => {
    console.log("🚀 ~ validateProfileData ~ req:", req.body)

    const allowedEditFields = ["firstName", "lastName", "email", "age", "gender", "photoUrl", "about", "skills"];

    const invalidFields = Object.keys(req.body).filter(
        (key) => !allowedEditFields.includes(key)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: "Invalid fields in request body",
            invalidFields: invalidFields
        });
    }
    return true

}



const validatePasswordData = (req) => {

    const allowedEditFields = ["oldPassword", "newPassword"];

    const invalidFields = Object.keys(req.body).filter(
        (key) => !allowedEditFields.includes(key)
    );

    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: "Invalid fields in request body",
            invalidFields: invalidFields
        });
    }
    return true

}


module.exports = { validateProfileData, validatePasswordData }