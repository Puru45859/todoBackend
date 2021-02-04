var Detail = require("./user.model");
const bcrypt = require("bcrypt");
const saltRounds = 5;
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.resetPassword = async (req, res) => {
  console.log("enter");
  const pass = req.body;
  console.log("pass", pass);
  try {
    console.log("inside try");
    const old = await Detail.findOne({ email: req.params.email }, ["token"]);
    console.log("old", old);

    return res.json({
      data: pass,
      status: "SUCCESS",
      message: "data added successfully.",
    });
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: error,
    });
  }
};
exports.forgotPassword = async (req, res) => {
  console.log("heyyyy");
  // const { sendemail } = req.body;
  try {
    // console.log("email", req.body.email);
    const user = await Detail.findOne({ email: req.body.email }, ["email"]);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        error: "NO_USER_FOUND",
        status: "FAIL",
        message: "User does not exist.",
      });
    } else {
      console.log("in else");
      let token = crypto.randomBytes(20).toString("hex");
      console.log("token", token);
      user.forgotPasswordToken = token;
      user.save();
      console.log("user save", user);

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        // // host: "imap.gmail.com",
        port: 587, //587
        secure: false, // true for 465, false for other ports
        auth: {
          //   user: "puru.gamer789@gmail.com", // generated ethereal user
          //   pass: "puru@12345PURU", // generated ethereal password

          user: "ankitchauhan.mobilyte@gmail.com",
          pass: "wfapiyjbsbzuirod",
        },
        // // tls: {
        // //   rejectUnauthorized: false,
        // // },
      });

      // send mail with defined transport object
      try {
        console.log("user MAIL");

        let info = await transporter.sendMail({
          from: "<puru.thegamer789@gmail.com>",
          to: req.body.email,
          subject: "New Mail",
          text: `<a href = "localhost:8080/api/user/reset-password/${token}`,
        });
        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.log("rtrty", error);
        return res.status(404).json({
          error: "mail send ",
          status: "success",
          message: error,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "error",
      status: "failed",
      message: error,
    });
  }
};

//deleteDeatils
exports.deleteDetails = async (req, res) => {
  const userId = req.params._id; //for params
  // const { userId } = req.query._id; //for query
  // console.log("userId", userId);
  try {
    const users = await Detail.findOneAndDelete({ _id: userId });
    console.log("users", users);
    return res.json({
      data: users,
      status: "SUCCESS",
      message: "users deleted successfully.",
    });
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: error,
    });
  }
};
//getUserDeatils
exports.getUserDetails = async (req, res) => {
  try {
    // const users = await Detail.findOne({ _id: req.query._id });
    return res.json({
      data: await Detail.find({}),
      // data: users,
      status: "SUCCESS",
      message: "All users fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: error,
    });
  }
};

//getUserDeatils by Id Query
exports.getUserDetailsByIdquery = async (req, res) => {
  try {
    const users = await Detail.findOne({ _id: req.query._id });
    return res.json({
      // data: await Detail.find({}),
      data: users,
      status: "SUCCESS",
      message: " users fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: error,
    });
  }
};

//getUserDeatils by Id params
exports.getUserDetailsByIdparams = async (req, res) => {
  try {
    const users = await Detail.findOne({ _id: req.params.id });
    return res.json({
      // data: await Detail.find({}),
      data: users,
      status: "SUCCESS",
      message: " users fetched successfully.",
    });
  } catch (error) {
    return res.json({
      status: "FAIL",
      message: error,
    });
  }
};

// User exists or Not(Signup)
exports.sendUserDetails = async (req, res) => {
  if (req.body) {
    try {
      let newDetail = await Detail.findOne({ email: req.body.email });
      if (newDetail) {
        return res.json({ success: true, message: " User already exists" });
      } else {
        let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
        let details = new Detail(req.body);

        let emailToken;
        try {
          emailToken = await sendToken(details);
        } catch (error) {
          // console.error(error);
        }
        details.emailToken = emailToken;
        let Userdoc = await details.save();

        if (true) {
          let msg =
            "http://localhost:8080/app/user/verificationEmail/" + emailToken;
          await sendEmail(msg);

          let updatedUserDetail = await Detail.findByIdAndUpdate(
            Userdoc._id,
            { $set: { password: hashedPassword, isActive: true } },
            { new: true }
          );
          await updatedUserDetail.save();
          return res.json({
            sucess: true,
            data: updatedUserDetail,
            message: "detail submiited",
          });
        }
      }
    } catch (err) {
      console.log("error", err);
      return res.json({ success: false, data: "", message: err });
    }
  } else {
    console.log("ERROR", err);
    return res.json({ success: false, data: "", message: "Parameter missing" });
  }
};

// Login
exports.verifyDetail = async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      let findUserDetail = await Detail.findOne({ email: req.body.email });
      if (findUserDetail) {
        let verifyToken = await sendToken(findUserDetail);
        let comparedPassword = await bcrypt.compare(
          req.body.password,
          findUserDetail.password
        );
        if (comparedPassword) {
          findUserDetail.token = verifyToken;
          await findUserDetail.save();
          return res.json({
            success: true,
            // data: verifyToken,
            data: findUserDetail,
            message: "Details matched successfully!!!",
          });
        } else {
          return res.json({
            success: false,
            data: "",
            message: "Incorrect paassword entered...",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Invalid Credentials",
          data: "",
        });
      }
    } catch (err) {
      // console.log("error", err);
      return res.json({ status: false, message: err, data: "" });
    }
  } else {
    return res.json({
      success: false,
      message: "Missing parameters",
      data: "",
    });
  }
};

// VerifyToken
exports.VerifyToken = (req, res) => {
  if (req.body.token) {
    jwt.verify(
      req.body.token,
      "AssignmentFirst",
      async function (err, decoded) {
        if (err) {
          return res.json({ success: false, message: "Incorrect  token" });
        }
        let verifyToken = await Detail.findOne({ _id: decoded._id });
        if (verifyToken) {
          return res.json({ success: true, message: "token verified" });
        } else {
          return res.json({ success: false, message: "token not verified" });
        }
      }
    );
  } else {
    return res.json({ success: false, message: "parameter missing" });
  }
};

// Verifyemail
exports.verificationEmail = async (req, res) => {
  if (req.params.emailToken) {
    let findUserDetail = await Detail.findOne({
      emailToken: req.params.emailToken,
    });
    if (findUserDetail) {
      findUserDetail.isActive = true;
      await findUserDetail.save();

      let msg = "Your account is verified and now you can login";
      await sendEmail(msg);
      return res.json({
        success: true,
        data: findUserDetail,
        message: "User Activated",
      });
    } else {
      return res.json({ success: false, data: " ", message: "Invalid Code" });
    }
  }
};

async function sendEmail(msg) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "puru.gamer789@gmail.com", // generated ethereal user
      pass: "puru@12345PURU", // generated ethereal password
    },
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: "<puru.thegamer789@gmail.com>",
      to: "puru.thegamer789@gmail.com",
      subject: "Hello ✔",
      text: msg,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    // console.log(error);
  }
}

async function sendToken(findUserDetail) {
  let token = await jwt.sign({ _id: findUserDetail._id }, "AssignmentFirst", {
    algorithm: "HS256",
    expiresIn: "1h",
  });
  await Detail.findByIdAndUpdate(
    findUserDetail._id,
    { $set: { token: token } },
    { new: true }
  );
  return token;
}
