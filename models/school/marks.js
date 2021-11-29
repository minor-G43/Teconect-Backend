const mongoose = require('mongoose');

// Add Marks
const addMarks = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	reg : {
		type : String,
		required : true
	},
	course : {
		type: String, 
		enum: ['english','maths','science','social']
	},
	marks : {
		type : Number,
		required : true
	}
})

const Schema = mongoose.model("addmarks", addMarks);

module.exports = Schema;