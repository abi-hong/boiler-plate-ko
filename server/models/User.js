const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

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

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567      암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}
//파라미터에 callback function이 하나만 들어있기 때문
userSchema.methods.generateToken = function(cb) {
    //user 가져오기 위해서
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token
    //-> 나중에 토큰을 해석할 때, 아래와 같이 secretToken을 넣는다면 
    //user._id를 얻을 수 있다.
    //'secretToken' -> user._id
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user) //에러가 없다면 유저 정보만 전달해주면 된다.
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //user._id + '' = token
    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

//이 스키마를 모델로 감싸줌
const User = mongoose.model('User', userSchema)
// 이모델을 다른 파일에서도 쓸 수 있도록 export해준다.
module.exports = {User}