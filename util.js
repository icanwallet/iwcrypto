const axios = require('./ajax.js')
const checkTime = i => i < 10 ? ("0" + i) :  i
/**
 * 格式化时间
 */
export const getDate = date =>  {
	var date = new Date(parseInt(date) * 1000);
	var hours = checkTime(date.getHours()) + ':' + checkTime(date.getMinutes()) + ':' + checkTime(date.getSeconds());
	return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ' ' + hours;
}
/**
 * 位符转换
 */
export const fixNumber = (num, decimal, fix = 3) => Number(num / Math.pow(10, decimal)).toFixed(fix) * 1
//ajax
export const ajax = axios
//node url 
export const getNodeUrl = nodeurl => nodeurl.find(el => el.isdef == 1).url

