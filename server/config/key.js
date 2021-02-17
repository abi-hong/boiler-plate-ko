//환경변수 = process.env.NODE_ENV
//만약 development 모드라면 환경변수는 dev.js를 가리키고
//production 모드라면 환경변수는 prod.js를 가리킨다.
if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}