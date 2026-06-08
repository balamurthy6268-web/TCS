//intersection is a hybrid of two types
//need real world automation examples

type A = {
  name: string;
};

type B = {
  age: number;
};

type C = A & B;

const obj: C = {
  name: "Bala",
  age: 30
};

console.log(obj);