const mongoose=require("mongoose")
const ledgerModel=require("../models/ledger.model")

const accountSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must have a user!"],
        index:true //for optimizing search ds used is  B+tree
    },

    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be only ACTIVE,FROZEN or CLOSED" ,
        },
        default: "ACTIVE" 
    },

    currency:{
        type:String,
        required:[true,"currency is requried for account"],
        default:"INR"
    }
},{
    timestamps:true
})
//compound index is created (containing 2 indexs)
accountSchema.index({user:1,status: 1})

accountSchema.methods.getBalance=async function () {
    //returns array
    const balanceData=await ledgerModel.aggregate([
        {$match : {account: this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            { $eq: ["$type", "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            { $eq: ["$type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id: 0,
                balance:{ $subtract :["$totalCredit" , "$totalDebit"]}
            }
        }
    ])

    // for new account emtpy array is given
    if(balanceData.length === 0 ){
        return 0
    }

    return balanceData[ 0 ] .balance
}

const accountModel=mongoose.model("account",accountSchema)

module.exports=accountModel
