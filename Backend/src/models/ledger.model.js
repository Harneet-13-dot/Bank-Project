const mongoose =require('mongoose');

const ledgerSchema=new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true,"Ledger must be associated with account"],
        index:true,
        immutable:true //once value given cant be changed
    },

    amount:{
        type:Number,
        required:[true,"Amount for ledger entry"],
        immutable:true
    },

    transaction:{
        //id
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required: [true,"Ledger must be with transaction"],
        index:true,
        immutable:true
    },

    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be Credit or Debit only"
        },
        required:[true,"Ledger type is required"],
        immutable:true
    }

})


function preventLedgerModification() {
    throw new Error("Ledger enteries are immutable , cant be modified or deleted")
}
//these functions are not applicable on our ledger modell

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);

const ledgerModel=mongoose.model("ledger",ledgerSchema)
module.exports=ledgerModel