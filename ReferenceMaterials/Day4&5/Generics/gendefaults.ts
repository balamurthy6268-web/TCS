//Generics with default types

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  ok: boolean;
}

const r1: ApiResponse = { data: "weatherapi", status: 200, ok: true };
const r2: ApiResponse<string[]> = {
  data: ["item1"], status: 200, ok: true
};
console.log(r1.data); // type is unknown
console.log(r2.data[0]); // type is string
