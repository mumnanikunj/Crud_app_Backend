import mongoose from "mongoose";



const projectSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        index:true,
    },
    description:{
        type:String,
        index:true,
    },
    dateAndTime:{
        type: String,
        default: () => new Date().toLocaleString(),  
        index: true,
    },

},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Project', projectSchema);
