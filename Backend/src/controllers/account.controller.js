const accountModel=require("../models/account.model")

async function createAccountController(req,res){
    
    // const userId=req.user;

    // const account=await accountModel.create({
    //     user: user._id
    // })
    const userId = req.user._id;

    const account = await accountModel.create({
        user: userId
    });

    res.status(201).json({
        message:"Account CREATED!",
        account
    })
}

async function getUserAcccountsController(req,res){
    const accounts=await accountModel.find({user: req.user._id});

    res.status(200).json({
        accounts
    })
}


async function getAccountBalanceController(req,res){
    const {accountId} =req.params;

    const account=await accountModel.findOne({
        _id:accountId,
        user: req.user._id
    })

    if(!account){
        return res.status(404).json({
            messsage:"Account not found!"
        })
    }

    const balance=await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}
module.exports={
    createAccountController,
    getUserAcccountsController,
    getAccountBalanceController
}