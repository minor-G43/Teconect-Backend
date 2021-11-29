const mongoose = require('mongoose');

// Add Teacher
const addTeacher = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	TId : {
		type : String,
		required : true
	},
	pass :{
		type : String,
		required : true
	},
	date : {
		type : Date,
		default : Date.now
	},
	age : {
		type : Number,
		requried : true
	},
	gender : {
		type: String, 
		enum: ['male','female','other']
	},
	course : {
		type : String,
		required : true
	},
	contact : {
		type : Number,
		required : true
	},
	address : {
		type : String,
		required : true
	}
})

const Schema = mongoose.model("addTeacher", addTeacher);

module.exports = Schema;