const mongoose = require('mongoose');

// Add Teacher
const addTeacher = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	TID : {
		type : String,
		required : true
	},
	fanme: {
		type : String
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