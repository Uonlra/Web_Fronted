const user = {
    id: 1,
    name: 'Alice',
    age: 30,
    email: 'alice@example.com'
}

console.log(user.name); // Output: 'Alice'
console.log(user['email']); // Output: '

user.age  = 20;
console.log(user.age); // Output: 20

user.id = 2;
console.log(user.id); // Output: 2

user.city = 'New York';
console.log(user.city); // Output: 'New York'

const product = {
    name: 'laptop',
    price: 50000,
    instock: true,
    count : 2,
    getTotal(){
        return this.price * this.count;
    }
}
console.log(product.getTotal()); // Output: 100000

const userWhithAddress = {
    name: 'Bob',
    age: 25,
    address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA'
    }
}
console.log(userWhithAddress.address.city); // Output: 'New York'

const users = [
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'},
];
console.log(users[0].name); // Output: 'Alice'  

const adults = users.filter(user => user.age >= 18);
console.log(adults); // Output: [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 3, name: 'Charlie'}]

const targetUser = users.find(user => user.name === 'Bob');
console.log(targetUser); // Output: {id: 2, name: 'Bob'}
