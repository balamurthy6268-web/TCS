interface User {
  id: number;
  name: string;
  email?: string; // optional
}
//Pick<User, "id" | "name">
// { id: number; name: string }
// use case: shape a DTO / API response

type UserDTO = Pick<User, "id" | "name">;

//Omit<User, "email">
// { id: number; name: string }
// use case: exclude sensitive fields

type UserWithoutEmail = Omit<User, "email">;

const scoresRecord: Record<"alice" | "bob", number> = {
  alice: 95, bob: 87
};