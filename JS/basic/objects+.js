const user = {
    name: 'Alice',
    age: 30,
    city: 'New York'
};

console.log(user.name); // Output: 'Alice'
console.log(Object.keys(user)); // Output: ['name', 'age', 'city']
console.log(Object.values(user)); // Output: ['Alice', 30, 'New York']

for(const [key, value] of Object.entries(user)){ //Object.entries 遍历 user，打印 key 和 value
    console.log(`${key}: ${value}`);
    console.log(key, value); // Output: 'name: Alice', 'age: 30', 'city: New York'
}

const {name, age} = user; //对象解构赋值
console.log(name); // Output: 'Alice'
console.log(age); // Output: 30

const { city: userCity} = user; //对象解构赋值，重命名 city 为 userCity
console.log(userCity); // Output: 'New York'

const numbers = [1, 2, 3, 4, 5];
const newNumbers = [...numbers, 6, 7]; //使用扩展运算符创建新数组
console.log(newNumbers); // Output: [1, 2, 3, 4, 5, 6, 7]

const fronted = ['HTML', 'CSS', 'JavaScript'];
const jsFrameworks = ['React', 'Vue', 'Angular'];

const skills = [...fronted, ...jsFrameworks]; //使用扩展运算符合并数组
console.log(skills); // Output: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular']

const updatedUser = {...user, age: 35}; //使用扩展运算符创建新对象，更新 age 属性
console.log(updatedUser); // Output: {name: 'Alice', age: 35, city: 'New York'}
console.log(user); // Output: {name: 'Alice', age: 30, city: 'New York'} (原对象未修改

const baseInfo = {
    name: 'Alice',
};

const details = {
    age: 30,
    city: 'New York'
};
const fullInfo = {
    ...baseInfo,
    ...details
};
console.log(fullInfo); // Output: {name: 'Alice', age: 30, city: 'New York'}
