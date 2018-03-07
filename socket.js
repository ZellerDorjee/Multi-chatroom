// import {
// 	readFile,
// 	writeFile
// } from './fs-async.js';
var fss = require('./fs-async.js') 
const filePath = `${__dirname}/user.json`

// socket具体业务逻辑
exports.socketHander= {
	/**
	 * [saveUserSocketId 保存用户的id和socketid]
	 * @param  {[type]} userId   [用户id]
	 * @param  {[type]} socketId [用户的socketid//目前暂时为昵称]
	 * @return {[type]}          [description]
	 */
	 async saveUserSocketId(userId, socketId) {
		let data = await fss.readFile(filePath).catch((err) => {
			console.log(err)
		})
		data[userId] = socketId
		fss.writeFile(filePath, data)
    },
     async readUserSocketId() {
		let data = await fss.readFile(filePath).then(data=>{
		    return  data;
        }).catch((err) => {
			console.log(err)
		});
	}
}