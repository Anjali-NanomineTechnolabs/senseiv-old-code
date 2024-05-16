import moment from "moment-timezone";

const currentTime = moment().tz('Asia/Kolkata')
const currentHour = currentTime.get('hour')
console.log(currentHour)