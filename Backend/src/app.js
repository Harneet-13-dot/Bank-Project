const express=require("express")
const cookieParser=require("cookie-parser")

const app=express();

const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:5173",
    "https://bank-project-1-h4vc.onrender.com"
  ],
  credentials: true
}));
/**
 * -MiddleWares
 */

app.use(express.json()) //reading content of body
app.use(cookieParser())

/**
 * - Routes Required
 */

const authRouter = require("./routes/auth.routes")
const accountRouter=require("./routes/accounts.routes")
const transactionRoutes=require("./routes/transaction.routes")
const requestRoutes=require("./routes/request.routes")
const userRoutes=require("./routes/user.routes")
/**
 * - Use Routes
 */
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRoutes)
app.use("/api/request",requestRoutes)
app.use("/api/user", userRoutes);

module.exports=app
