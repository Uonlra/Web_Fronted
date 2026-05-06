const products = [
    {id:1, name: 'laptop', price: 50000, instock: true},
    {id:2, name: 'mobile', price: 20000, instock: false},
    {id:3, name: 'tablet', price: 30000, instock: true},
];

const productNames = products.map(product => product.name);
console.log(productNames); // Output: ['laptop', 'mobile', 'tablet']

const availableProducts = products.filter(product => product.instock);
console.log(availableProducts);

const keyboard = products.find(product => product.name === 'keyboard');
console.log(keyboard); // Output: undefined

const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
console.log(totalPrice); // Output: 100000


const skills = ['JavaScript', 'Python', 'Java', 'C++'];

skill.push('Ruby');
console.log(skills); // Output: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby']

const colors = ['red', 'green', 'blue'];
colors.splice(1, 1);
console.log(colors); // Output: ['red', 'blue']

const numbers = [1, 2, 3, 4, 5];
const doubledNummbers = numbers.maop(num => num * 2);
console.log(doubledNummbers); // Output: [2, 4, 6, 8, 10]

const ages = [25, 30, 35, 40];
const adults = ages.filter(age => age >= 18);
console.log(adults); // Output: [25, 30, 35, 40]

const price = [100, 200, 300];
const total = price.reduce((sum, p) => sum + p, 0);
console.log(total); // Output: 600

const users = [
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'},
];
const userName = users.map(user => user.name);
console.log(userName); // Output: ['Alice', 'Bob', 'Charlie']

const products2 = [
    {id: 1, name: 'laptop', price: 50000, instock: true},
    {id: 2, name: 'mobile', price: 20000, instock: false},
    {id: 3, name: 'tablet', price: 30000, instock: true},
];

const inStockProducts = products2.filter(product => product.instock);
console.log(inStockProducts); // Output: [{id: 1, name: 'laptop', price: 50000, instock: true}, {id: 3, name: 'tablet', price: 30000, instock: true}]

const userList = [
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'},
];
const targetUser = userList.find(user => user.id === 2);
console.log(targetUser); // Output: {id: 2, name: 'Bob'}

const cart = [
    {id: 1, name: 'laptop', price: 50000, quantity: 1},
    {id: 2, name: 'mobile', price: 20000, quantity: 2},
];

const totalCost = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
console.log(totalCost); // Output: 90000