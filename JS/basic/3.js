for (let i = 1; i <= 10; i++) {
    console.log(i);
}

let total = 0;
for (let i = 1; i <= 100; i++) {
    total += i;
}
console.log(total);

const numbers = [1, 2, 3, 4, 5];
let sum = 0;
for (const num of numbers) {
    sum += num;
}
console.log(sum);

const scores = [85, 92, 78, 90, 88];
let passedCount = 0;
for (const score of scores) {
    if (score >= 60) {
        passedCount++;
    }
}

console.log(`及格人数: ${passedCount}`);

const list = [12, 45, 67, 23, 89];
for (const number of list) {
    if(number > 50) {
        console.log(number);
        break; // 只输出第一个大于50的数字
    }
}

let count = 1;
while (count <= 5) {
    console.log(count);
    count++;
}