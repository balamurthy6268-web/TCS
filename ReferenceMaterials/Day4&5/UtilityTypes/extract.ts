//EXCLUDE, EXTRACT, NONNULLABLE

type Status = "active" | "inactive" | "pending";

// Exclude<Status, "inactive">

type ActiveStatus = Exclude<Status, "inactive">;
const ActiveStatus = "active"; // valid
console.log(ActiveStatus); // "active"


// "active" | "pending"

type PendingStatus = Extract<Status, "active" | "pending">;
// "active" | "pending"
const pendingStatus: PendingStatus = "pending";
console.log(pendingStatus); // "pending"


type MaybeString = string | null | undefined;
type NonNullableString = NonNullable<MaybeString>;
const str: NonNullableString = "hello"; // valid
// const str2: NonNullableString = null; // ❌ Type 'null' is not assignable to type 'string'.
// const str3: NonNullableString = undefined; // ❌ Type 'undefined' is not assignable to type 'string'.    


// string