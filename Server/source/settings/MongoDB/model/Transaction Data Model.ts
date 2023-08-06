export default {
    Balance: {type: Number, required: true},
    LastTransactionDate: {type: Date, required: true, default: Date.now()},
    LastTransactionType: {type: String, required: true},
    LastTransactionAmount: {type: Number, required: true},
    LastTransactionDescription: {type: String, required: true, default: "No description provided."},
    LastTransactionID: {type: Number, required: true},
    LastTransactionStatus: {type: String, required: true, default: "Pending"},
    AllPreviousTransactions: {type: Array, required: true, default: []}
} // export the transaction data model