function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
getLength("hello");    // 5
getLength([1, 2, 3]); // 3
// getLength(42) — ❌ number has no .length

function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Ana", age: 30 };
console.log(getField(user, "name")); // "Ana" — typed as string
console.log(getField(user, "age"));  // 30   — typed as number