// ============================================
// JS 进阶：闭包、作用域、原型链、this
// 国内前端实习面试高频考点
// ============================================

// ============================================
// 1. 作用域（Scope）
// ============================================

// JS 有三种作用域：全局作用域、函数作用域、块级作用域

// 全局作用域 —— 在最外层声明的变量
const globalVar = "我是全局变量";

function scopeDemo() {
  // 函数作用域 —— 只在函数内部可访问
  const funcVar = "我是函数内变量";

  if (true) {
    // 块级作用域 —— let/const 在 {} 内有效
    const blockVar = "我是块级变量";
    console.log(blockVar); // 可以访问
  }

  // console.log(blockVar); // 报错！块级变量在外面访问不到
  console.log(funcVar); // 可以访问
}

// console.log(funcVar); // 报错！函数内变量在外面访问不到

// 作用域链 —— 内层可以访问外层，外层不能访问内层
const outer = "外层";

function outerFn() {
  const middle = "中层";

  function innerFn() {
    const inner = "内层";
    // 内层可以访问所有外层变量
    console.log(outer); // "外层"
    console.log(middle); // "中层"
    console.log(inner); // "内层"
  }

  innerFn();
  // console.log(inner); // 报错！外层不能访问内层
}

// ============================================
// 2. 闭包（Closure）—— 面试必考！
// ============================================

// 闭包 = 函数 + 它能访问的外部变量
// 当内部函数引用了外部函数的变量，即使外部函数已经执行完毕，
// 那个变量也不会被销毁，因为内部函数还在"记住"它

// 最经典的闭包例子：计数器
function createCounter() {
  let count = 0; // 这个变量被"关"在闭包里

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
// 外部无法直接访问 count，只能通过方法操作 —— 这就是"数据私有化"

// 闭包的实际用途：
// 1. 数据私有化（模拟私有变量）
// 2. 函数工厂
// 3. 缓存/记忆化

// 函数工厂
function createGreeter(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Tom")); // "Hello, Tom!"
console.log(sayHi("Alice")); // "Hi, Alice!"

// 经典面试题：循环中的闭包
// 错误写法（用 var）
function name(params) {
  for (var i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log("var:", i); // 全部输出 3！
    }, 100);
  }
}
// 因为 var 没有块级作用域，循环结束后 i = 3

// 正确写法（用 let）
for (let j = 0; j < 3; j++) {
  setTimeout(() => {
    console.log("let:", j); // 输出 0, 1, 2
  }, 200);
}
// let 有块级作用域，每次循环都创建一个新的 j

// ============================================
// 3. 原型和原型链（Prototype Chain）—— 面试必考！
// ============================================

// JS 中每个对象都有一个隐藏属性 __proto__，指向它的"原型"
// 当访问一个属性时，如果对象自身没有，就沿着原型链向上找

// 构造函数
function Person(name, age) {
  this.name = name; // this → 新对象,person 实例
  this.age = age;
}

// 在原型上定义方法（所有实例共享，节省内存）
Person.prototype.sayHello = function () {
  return `我是 ${this.name}，今年 ${this.age} 岁`;
};

const tom = new Person("Tom", 22);
const alice = new Person("Alice", 25);

console.log(tom.sayHello()); // "我是 Tom，今年 22 岁"
console.log(alice.sayHello()); // "我是 Alice，今年 25 岁"

// tom 和 alice 共享同一个 sayHello 方法
console.log(tom.sayHello === alice.sayHello); // true

// 原型链查找过程：
// tom.sayHello
// → tom 自身没有 → 去 tom.__proto__（即 Person.prototype）找
// → 找到了！

// tom.toString
// → tom 自身没有 → Person.prototype 没有
// → Object.prototype 上有 → 找到了！

// tom.xxx
// → tom 没有 → Person.prototype 没有
// → Object.prototype 没有 → null（链的尽头）
// → 返回 undefined

// ES6 class 语法（本质还是原型链，只是语法糖）
class Animal {
  constructor(name) { //constructor 是构造函数，实例化时调用
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal { //dog 继承 animal
  constructor(name, breed) {
    super(name); // 调用父类构造函数
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog("Buddy", "Golden");
console.log(dog.speak()); // "Buddy barks"
console.log(dog.__proto__ === Dog.prototype); // true __proto__ 指向构造函数的 prototype
console.log(Dog.prototype.__proto__ === Animal.prototype); // true, prototype 链：dog → Dog.prototype → Animal.prototype → Object.prototype
console.log(dog.constructor === Dog); // true
console.log(dog instanceof Dog); // true, instanceof 判断对象是否是某个构造函数的实例
console.log(dog instanceof Animal); // true

// ============================================
// 4. this 指向 —— 面试必考！
// ============================================

// this 的值取决于函数的调用方式，不是定义位置

// 规则 1：普通函数调用 → this 指向 window（严格模式下是 undefined）
function normalFn() {
  console.log(this); // window（浏览器中）
}

// 规则 2：对象方法调用 → this 指向调用它的对象
const user = {
  name: "Tom",
  greet() {
    console.log(this.name); // "Tom"
  },
};
user.greet(); // this → user

// 规则 3：new 调用 → this 指向新创建的对象
function Car(brand) { // Car 是构造函数，实例化时调用
  this.brand = brand; // this → 新对象
}
const myCar = new Car("Tesla"); // this → myCar

// 规则 4：箭头函数 → 没有自己的 this，继承外层的 this
const obj = {
  name: "Alice",
  // 普通函数：this 指向 obj
  normalMethod() {
    console.log("normal:", this.name); // "Alice"
  },
  // 箭头函数：this 继承外层（这里是全局）
  arrowMethod: () => {
    console.log("arrow:", this.name); // undefined,外层没有 name 属性
  },
  // 常见场景：在方法内部用箭头函数
  delayedGreet() {
    // 箭头函数继承 delayedGreet 的 this（即 obj）
    setTimeout(() => {
      console.log("delayed:", this.name); // "Alice"
    }, 100);
  },
};
console.log(obj.normalMethod()); // "Alice"
console.log(obj.arrowMethod()); // undefined
obj.delayedGreet(); // "Alice"

// 规则 5：call / apply / bind 手动指定 this
function introduce(city) {
  return `我是 ${this.name}，来自 ${city}`;
}

const person = { name: "Jack" };

// call：立即调用，参数逐个传
console.log(introduce.call(person, "Beijing"));

// apply：立即调用，参数用数组传
console.log(introduce.apply(person, ["Shanghai"]));

// bind：不立即调用，返回一个新函数
const boundFn = introduce.bind(person);
console.log(boundFn("Shenzhen"));

// ============================================
// 经典面试题
// ============================================

// 题目 1：this 指向
const obj2 = {
  name: "obj2",
  fn: function () { //fn 是 obj2 的方法，this → obj2
    return this.name;
  },
};

const fn = obj2.fn;
console.log(obj2.fn()); // "obj2" —— 对象调用
console.log(fn()); // undefined —— 普通调用，this 指向 window

// 题目 2：闭包 + 计数
function makeAdder(x) {
  return function (y) { // 内部函数形成闭包，记住了 x
    return x + y;
  };
}

const add5 = makeAdder(5); // add5 是一个函数，在 makeAdder 的作用域内，x = 5 被"关"在闭包里
const add10 = makeAdder(10);

console.log(add5(3)); // 8
console.log(add10(3)); // 13

// 题目 3：手写 instanceof
function myInstanceof(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);

  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

console.log(myInstanceof(dog, Dog)); // true
console.log(myInstanceof(dog, Animal)); // true
console.log(myInstanceof(dog, Person)); // false

// ============================================
// 重点总结
// ============================================
/*
作用域：
  - 全局 > 函数 > 块级
  - 内层能访问外层，外层不能访问内层
  - let/const 有块级作用域，var 没有

闭包：
  - 函数 + 它引用的外部变量
  - 用途：数据私有化、函数工厂、缓存
  - 面试题：循环 + setTimeout（var vs let）

原型链：
  - 每个对象有 __proto__ 指向原型
  - 属性查找沿原型链向上
  - class 是语法糖，底层还是原型

this 指向：
  - 普通调用 → window
  - 对象方法 → 调用者
  - new → 新对象
  - 箭头函数 → 继承外层
  - call/apply/bind → 手动指定
*/
