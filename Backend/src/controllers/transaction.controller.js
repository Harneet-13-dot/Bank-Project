const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const accountModel=require("../models/account.model")
const mongoose=require('mongoose')

async function createTransaction(req,res) {
    /** Validating accounts */

    const {fromAccount, toAccount , amount, idempotencyKey} =req.body
    //middleware will check verified user or not

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount ,amount or key is invalid"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount
    })

    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "fromAccount, toAccount may be invalid"
        })
    }

    /**
     * 2. validate key (not to repeat the same transaction again again)
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    
    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status ==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction was successful"
            })
        }
        if(isTransactionAlreadyExists.status ==="PENDING"){
            return res.status(200).json({
                message:"Transaction still processing"
            })
        }
        if(isTransactionAlreadyExists.status ==="FAILED"){
            return res.status(500).json({
                message:"Transaction was Failed sori"
            })
        }
        if(isTransactionAlreadyExists.status ==="REVERSED"){
            return res.status(500).json({
                message:"Transaction was Reversed"
            })
        }
    }


    /**
     * checking active status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * checkign sufficiant balance */  
    
    const balance=await fromUserAccount.getBalance()

    if(balance<amount) {
        return res.status(400).json({
            message:'Insufficient Balance'
        })
    }
    /**
     * 5. transaction pending
     */
    let transaction;
    try{

        const session = await mongoose.startSession()
        session.startTransaction()
        
        //now either everything will be done or nothing (session use)

        transaction=(await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING",
        }],{session}))[ 0 ]

        const creditLedger=await ledgerModel.create([{
            account:toAccount,
            amount:amount,
            transaction: transaction._id,
            type:"CREDIT"
        }],{session})

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 10 * 1000));
        })()
        
        const debitLedger=await ledgerModel.create([{
            account:fromAccount,
            amount:amount,
            transaction: transaction._id,
            type:"DEBIT"
        }],{session})

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )
        
        await session.commitTransaction()
        session.endSession()
}
    catch (error) {

        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })

    }

    return res.status(201).json({
        message:"Transaction Done :)",
        transaction:transaction
    })
}

async function createInitialFundsTransaction(req,res){
    const { toAccount, amount, idempotencyKey}=req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount , amount , key are required"
        })
    }

    const toUserAccount=await accountModel.findOne({
        _id: toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"invalid toAccount"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        // systemUser:true,
        user: req.user._id
    })

    if(!fromUserAccount) {
        return res.status(400).json({
            message:"system user account not found"
        })
    }

    const session=await mongoose.startSession()
    session.startTransaction()

    const transaction=new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message:"Initial funds transaction completed successfully",
        transaction: transaction
    })

}

async function getTransactions(req, res) {
  try {
    const userId = req.user._id;

    // find user's accounts
    const accounts = await accountModel.find({ user: userId });

    //extracing account id
    const accountIds = accounts.map(acc => acc._id);

    // find transactions where user is sender OR receiver
    const transactions = await transactionModel
  .find({
    $or: [
      { fromAccount: { $in: accountIds } },
      { toAccount: { $in: accountIds } }
    ]
  })
  .populate({
    path: "fromAccount",
    populate: {
      path: "user",
      select: "name"
    }
  })
  .populate({
    path: "toAccount",
    populate: {
      path: "user",
      select: "name"
    }
  })
  .sort({ createdAt: -1 })
  .lean();//newest first

    res.json({
      transactions
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching transactions"
    });
  }
}

module.exports={
    createTransaction,createInitialFundsTransaction,
    getTransactions
}
