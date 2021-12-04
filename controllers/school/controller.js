const Student = require('../../models/school/student');
const Marks = require('../../models/school/marks');
const Attandence = require('../../models/school/attandence');
const Teacher = require('../../models/school/teacher');

exports.registerStu = async (req, res, next) => {
    // {
    //     "name" : "somya" ,
    //       "mname" : " " ,
    //     "fname" : "uyw",
    //     "reg" : "098765",
    //     "pass" : "1234567890",
    //     "date" : "7654",
    //     "age" : "18",
    //     "gender" : "M",
    //     "cls" : "12",
    //     "contact" : "098765432",
    //     "address" : " kyiuyiuuiyi"
    //   }

    try {
        let {
            name,
            mname,
            fname,
            reg,
            pass,
            date,
            age,
            gender,
            cls,
            contact,
            address
        } = req.body;
        const user = await Student.create({
            name: name,
            mname: mname,
            fname: fname,
            reg: reg,
            pass: pass,
            date: date,
            age: age,
            gender: gender,
            cls: cls,
            contact: contact,
            address: address
        });
        console.log(user);
        res.status(201).send({
            status: 201,
            statusText: "register success",
            user: user
        })
        console.log("register success");
    } catch (error) {
        res.send({
            error: error
        });
    }
};
exports.registerTec = async (req, res, next) => {
    // {
    //     "name" : "somya",
  	// 	"TID" : "97867",
    //     "fname" : "uyw",
    //     "pass" : "1234567890",
    //     "date" : "7654",
    //     "age" : "18",
    //     "gender" : "M",
  	// 	"course" : "jkhgfd",
    //     "contact" : "098765432",
    //     "address" : " kyiuyiuuiyi"
    //   }
    try {
        let {
            name,
            TID,
            fname,
            pass,
            date,
            age,
            gender,
            course,
            contact,
            address
        } = req.body;
        const user = await Teacher.create({
            name,
            TID,
            fname,
            pass,
            date,
            age,
            gender,
            course,
            contact,
            address
        });
        console.log(user);
        res.status(201).send({
            status: 201,
            statusText: "register success",
            user: user
        })
        console.log("register success");
    } catch (error) {
        res.send({
            error: error
        });
    }
};

exports.login = async (req, res, next) => {
    // {
    //     "name" : "somya" ,
    //     "pass" : "1234567890"
    //   }
    try {
        let {
            name,
            pass
        } = req.body;
        const login = await Student.findOne({
            name: name,
            pass: pass
        });
        console.log(login);
        if (login != null) {
            res.status(201).send({
                status: 201,
                statusText: "login success",
                user: login
            })
        } else {
            res.send({
                status: "incorrect data"
            })
        }
    } catch (error) {
        res.send({
            error: error
        });
    }
};
exports.addmarks = async (req, res, next) => {
    // {
    //     "name": "somya",
    //     "reg": "098765",
    //     "course": "alpha",
    //     "marks": "1100"
    // }

    try {
        let {
            name,
            reg,
            course,
            marks
        } = req.body;
        const user = await Marks.create({
            name,
            reg,
            course,
            marks
        });
        console.log(user);
        res.status(201).send({
            status: 201,
            statusText: "marks added",
            user: user
        })

    } catch (error) {
        res.send({
            error: error
        });
    }
};
exports.fetchmarks = async (req, res, next) => {
    // {
    //     name : ""
    // }
    try {
        let {
            name
        } = req.body;
        const user = await Marks.findOne({
            name: name
        });
        console.log(user);
        if (user != null) {
            res.status(201).send({
                status: 201,
                statusText: "fetch success",
                user: user
            })
        } else {
            res.send({
                status: "incorrect data"
            })
        }
        console.log("register success");
    } catch (error) {
        res.send({
            error: error
        });
    }
};
exports.addattandence = async (req, res, next) => {
    // {
    //     "name": "somya",
    //     "reg": "098765",
    //     "date": "alpha",
    //     "attendance": "10%"
    // }
    try {
        let {
            name,
            reg,
            date,
            attandence
        } = req.body;
        const user = await Attandence.create({
            name,
            reg,
            date,
            attandence
        });
        console.log(user);
        res.status(201).send({
            status: 201,
            statusText: "marks added",
            user: user
        })

    } catch (error) {
        res.send({
            error: error
        });
    }
};
exports.fetchattandence = async (req, res, next) => {
    // {
    //     "name": "somya"
    // }
    try {
        let {
            name
        } = req.body;
        const user = await Attandence.findOne({
            name: name
        });
        console.log(user);
        if (user != null) {
            res.status(201).send({
                status: 201,
                statusText: "fetch success",
                user: user
            })
        } else {
            res.send({
                status: "incorrect data"
            })
        }
        console.log("register success");
    } catch (error) {
        res.send({
            error: error
        });
    }
};