const mongoose = require('mongoose');
const postSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true,
    },
    roomType : {
        type : String,
        required : true,
    },
    email: {
        type : Number,
        required : true,
    },
    persons : {
        type : Number,
        required : true,
    } 
});

mongoose.model('ReqData', postSchema);

