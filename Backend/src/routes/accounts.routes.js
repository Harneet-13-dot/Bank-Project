const express=require("express")
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")
const router =express.Router()

/**
 * -POST /api/accounts/
 * -Create a new Account
 * -Protected route (*req token*)
 */

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)
/**
 * GET /api/accconts/
 * Get all accounts of logged in user
 * -Protected route (*req token*)
 */

router.get("/",authMiddleware.authMiddleware,accountController.getUserAcccountsController)

/**
 * GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)

module.exports=router