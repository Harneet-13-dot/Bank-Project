const express=require("express")
const cookieParser=require("cookie-parser")

const app=express();

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bankproject-1wkofphf2-harneet-13-dots-projects.vercel.app"
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

/**
 * - Use Routes
 */
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRoutes)


module.exports=app
