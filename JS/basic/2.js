const age = 25;
if (age < 18) {
  console.log("You are a minor.");
} else if (age >= 18 && age < 65) {
  console.log("You are an adult.");
}

const score = 58;
if(sore >= 90) {
    console.log("Grade: A");
} else if(score >= 80) {
    console.log("Grade: B");
} else if(score >= 70) {
    console.log("Grade: C");
} else if(score >= 60) {
    console.log("Grade: D");
} else {
    console.log("Grade: F");
}

const inputName = "admin";
const inputPassword = "123456";

if (inputName === "admin" && inputPassword === "123456") { // 使用严格相等运算符进行比较
  console.log("登录成功");
} else {
  console.log("用户名或密码错误");
}

const number = 10;
if (number >= 1 && number <= 100) {
  console.log("数字在1到100之间");
} else {
  console.log("数字不在1到100之间");
}

const isVip = true;
const hasDiscount = false;
if (isVip || hasDiscount) {
  console.log("您有优惠");
} else {
  console.log("您没有优惠");
}

const temperature = 30;
const weatherMessage = temperature > 25 ? "天气炎热" : "天气凉爽";
console.log(weatherMessage); // Output: "天气炎热"

const dinalScore = 85;
if (finalScore >= 90) {
    console.log("成绩优秀");
}else if (finalScore >= 80) {
    console.log("成绩良好");
}
else if (finalScore >= 70) {
    console.log("成绩及格");
}
else {
    console.log("成绩不及格");
}