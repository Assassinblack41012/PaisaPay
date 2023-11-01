export default {
    UserClientID: {type: Number, required: true, default: 0},
    UserPaymentID: {type : String, required: true, default: 'example@pp'},
    UserName: {type: String, required: true},
    UserEmail: {type: String, required: true},
    UserPhone: {type: String, required: true, length: 10},
    TransactionID: {type: String, default: '00000', required: true, unique: true},
    TransactionDate: {type: Date, required: true, default: Date.now()},
    TransactionType: {type: String, required: true, default: "Add Funds"},
    TransactionAmount: {type: Number, required: true, default: 0},
    TransactionDescription: {type: String, required: true, default: "No description provided."},
    TransactionStatus: {type: String, required: true, default: "Success", index: true, enum: ["Success", "Pending", "Failed", "Cancelled", "Processing"]},
    TransactionMethod: {type: String, required: true, default: "Unknown"},
    TransactionFee: {type: Number, required: true, default: 0},
} // export the transaction data model