interface User {
  id: number;
  name: string;
  email?: string; // optional
}

type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }
// use case: patch/update payloads

const pu: PartialUser = { name: "Ana" }; // valid, id and email are optional

type RequiredUser = Required<User>
// { id: number; name: string; email: string }
// use case: after validation, all fields guaranteed
const ru: RequiredUser = { id: 1, name: "Ana", email: "ana@example.com" };

type ReadonlyUser = Readonly<User>
// { readonly id: number; readonly name: string; ... }
const frozen: Readonly<User> = { id: 1, name: "Ana" };
// frozen.id = 2  ❌ Cannot assign to readonly property