const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //스페이스를 없애주는 역할
        unique: 1 //동일한 이메일이 없도록
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //관리자(1) 혹은 일반 유저(0)
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})
//이 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema)
// 이모델을 다른 파일에서도 쓸 수 있도록 export해준다.
module.exports = {User}