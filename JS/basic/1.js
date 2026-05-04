const text = " JAVASCRIPT ";
console.log(text.trim()); // Output: "JAVASCRIPT"

const sentence = "I am learning JavaScript.";
console.log(sentence.includes("JavaScript")); // Output: true

const skills = "HTML, CSS, JavaScript, React";
console.log(skills.split(", ")); // Output: ["HTML", "CSS", "JavaScript", "React"]

const language = "JavaScript";
console.log(language.slice(0, 4)); // Output: "Java"

const price = 19.99;
const count = 3;
const total = price * count;
console.log(`Total price: $${total.toFixed(2)}`); // Output: "Total price: $59.97"

const numberText = "12345";
console.log(Number(numberText)); // Output: 12345

const size = '99px';
console.log(parseInt(size)); // Output: 99

const randomNumber = Math.floor(Math.random() * 100) + 1;
console.log(`Random number between 1 and 100: ${randomNumber}`); // Output: Random number between 1 and 100: (some random number)