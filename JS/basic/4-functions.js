function sayHello(name) {
    return "Hello, ${name}!";
}

console.log(sayHello("Alice")); // Output: Hello, Alice!

function add(a, b) {
    return a + b;
}
console.log(add(5, 3)); // Output: 8

function isAdult(age) {
    return age >= 18;
}

console.log(isAdult(20)); // Output: true
console.log(isAdult(15)); // Output: false

function getTotal(price, quantity) {
    return price * quantity;
}

console.log(getTotal(19.99, 3)); // Output: 59.97

function getGrade(score) {
    if (score >= 90) {
        return "A";
    } else if (score >= 80) {
        return "B";
    } else if (score >= 70) {
        return "C";
    } else if (score >= 60) {
        return "D";
    } else {
        return "F";
    }
}
console.log(getGrade(85)); // Output: B

const getRandomNumber = () =>{
    return Math.floor(Math.random() * 100) + 1;
}
console.log(`Random number between 1 and 100: ${getRandomNumber()}`); // Output: Random number between 1 and 100: (some random number)

const getRandomNumber = () => Math.floor(Math.random() * 100) + 1;
console.log(`Random number between 1 and 100: ${getRandomNumber()}`); // Output: Random number between 1 and 100: (some random number)