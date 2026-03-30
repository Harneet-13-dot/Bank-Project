const {Router} =require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { authSystemUserMiddleware }=require('../middleware/auth.middleware')


const transactionController=require("../controllers/transaction.controller")


const transactionRoutes=Router();

/**
 * - POST /api/transaction
 * - Create a new transaction
 */

transactionRoutes.post("/",authMiddleware,transactionController.createTransaction)

/**
 * POST /api/tansaction/system/initial-funds
 */
transactionRoutes.post("/system/initial-funds",authSystemUserMiddleware,transactionController.createInitialFundsTransaction)


transactionRoutes.get("/",authMiddleware,transactionController.getTransactions)
module.exports=transactionRoutes;