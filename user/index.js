var fetchRouter = require("router");
var router = fetchRouter();
const controller = require("../user/user.controller");

router.post("/forgot-Password", controller.forgotPassword); //forgotPassword
router.get("/reset-password/:email/:token", controller.resetPassword); //reset paswword

// router.delete("/deleteDetail", controller.deleteDetails); //delete detail with query
router.delete("/deleteDetail/:id", controller.deleteDetails); //delete detail with params
router.get("/getDetail", controller.getUserDetails); //getDetail
router.get("/getDetailById", controller.getUserDetailsByIdquery); //getDetail by id
router.get("/getDetailByParams/:id", controller.getUserDetailsByIdparams); //getDetail by id

router.post("/", controller.sendUserDetails); // For SignUp
router.post("/verifyDetail", controller.verifyDetail); //For Login
router.post("/verifyToken", controller.VerifyToken); // For Token Verification
router.get("/verificationEmail/:emailToken", controller.verificationEmail); // For email Verification

module.exports = router;
