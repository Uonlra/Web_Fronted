function formatDate(date) {
    const year = date.getFullYear();
    const mnth = String(date.getMonth() + 1).padStart(2, '0'); //月份从0开始，所以要加1. padStart(2, '0')确保月份是两位数
    const day = String(date.getDate()).padStart(2, '0'); //padStart(2, '0')确保日期是两位数
    return `${year}-${mnth}-${day}`;
}

const date = new Date(2024, 5, 15);

function getAge(birthDate) {
    const birthDateObj = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = now.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}
const birthDate = '1990-06-15';
console.log(formatDate(date)); // Output: '2024-06-15'
console.log(getAge(birthDate)); // Output: 34 (根据当前日期计算年龄)

const now = new Date();
console.log(now); // Output: 当前日期和时间，例如 '2024-06-15T12:00:00.000Z'

const year = now.getFullYear();
const month = now.getMonth() + 1; //月份从0开始，所以要加1
const day = now.getDate();
console.log(`今天是 ${year}年${month}月${day}日`); // Output: 今天是 2024年6月15日 (根据当前日期输出)

const hour = now.getHours();
const minute = now.getMinutes();
const second = now.getSeconds();
console.log(`当前时间是 ${hour}:${minute}:${second}`); // Output: 当前时间是 12:00:00 (根据当前时间输出)

const weekday = now.getDay(); //返回0-6，0表示周日，1表示周一，以此类推
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
console.log(`今天是${weekdays[weekday]}`); // Output: 今天是周六 (根据当前日期输出)

const formattedMonth = String(month).padStart(2, '0'); //确保月份是两位数
const formattedDay = String(day).padStart(2, '0'); //确保日期是两位数
const fomatted = `${year}-${formattedMonth}-${formattedDay}`;
console.log(`今天是 ${fomatted}`); // Output: 今天是 2024-06-15 (根据当前日期输出)

const start = new Date('2024-01-01');
const end = new Date('2024-12-31');
const diff = end.getTime() - start.getTime(); 
const days = diff / (1000 * 60 * 60 * 24); //将毫秒数转换为天数
console.log(days); 

function formatDate(date) {
    const year = date.getFullYear();
    const mnth = String(date.getMonth() + 1).padStart(2, '0'); //月份从0开始，所以要加1. padStart(2, '0')确保月份是两位数
    const day = String(date.getDate()).padStart(2, '0'); //padStart(2, '0')确保日期是两位数
    return `${year}-${mnth}-${day}`;
}
console.log(formatDate(new Date())); // Output: 当前日期，例如 '2024-06-15'

function getAge(birthDate) {
    const birthDateObj = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = now.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}
const birthDate = '1990-06-15';
console.log(getAge(birthDate)); // Output: 34 (根据当前日期计算年龄)