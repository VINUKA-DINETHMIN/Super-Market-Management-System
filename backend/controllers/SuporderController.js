import SOrderDetails from "../models/SOrderDetails.js";

export const createSOrder = async (req, res) => {
    const { ordernumber, companyname, deliverydate, amount} = req.body;

    const receipt = req.file.path;

    try {
        const newOrder = await SOrderDetails.create({
            ordernumber,
            companyname,
            deliverydate,
            amount,
            receipt
        });
        return res.status(201).json(newOrder);
    } catch (error) {
        // Handle database errors
        console.error("Error creating supplier:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAllSOrders = async (req, res) => {
    try {
        const orders = await SOrderDetails.find();
        
        res.status(200).json(orders);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getOneOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const SOrder = await SOrderDetails.findById(id);
        res.status(200).json(SOrder);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};