import mongoose from 'mongoose';

const SOrderSchema = new mongoose.Schema({
    ordernumber: {
        type: String,
        required: true
    },
    companyname: {
        type: String,
        required: true
    },
    deliverydate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
    },
    receipt: {
        type: String,
        required: true
    },

}, { timestamps: true });

const SOrderDetails = mongoose.model("sorderdetails", SOrderSchema);

export default SOrderDetails;