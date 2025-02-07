# @tolokoban/type-guards

TypeScript does a very good job at type checking during compilation.
But sometimes, you need type checking at runtime.

Look at this example:

```ts
const resp = await fetch("get-favourite-paintings")
const data = await resp.json()
```

What is the type of `data`? You know what you expect, but you don't know what you will actually get.
So casting it like this is dangerous: `const data = await resp.json() as Paintings[]`.

TypeScript has a solution for this: [type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

This library is just a helper to write complex type guards in a concise way.

## Recursivity

Suppose this type:

```ts
interface Tree {
    name: string
    children?: Tree[]
}
```

To describe it with the TypeGuard library you can use the fact that a `TypeDef` can be a function that returns a `TypeGuard`.

```ts
const treeTypeDef = () => ({
  name: "string",
  children: ["?", ["array", treeTypeDef]]
})
```

## Examples

```ts
import { assertType } from "@tolokoban/type-guards"

interface Article {
    id: string
    name: string
    price: number
}

function printArticles(data: unknown): Article[] {
    assertType<Article[]>(
        data,
        [
            "array", {
                id: "string",
                name: "string",
                price: "number"
            }
        ]
    )
    for (const article of data) {
        console.log(`#{article.name} #${article.id}`)
    }
}
```

```ts
interface Complex { r: number, i: number }
const complex = ensureType<Complex>(data, {r: "number", i: "number"}, { r: 1, i: 0 })
```

```ts
interpace PersonVersion1 {
  name: string
  female: boolean
}
interpace PersonVersion2 {
  name: string
  gender: "male" | "female" | "nonbinary" | "unknown"
}
const data = JSON.parse(LocalStorate.getItem("person") ?? "null")
const TypePersonVersion1 = {
  name: "string",
  female: "boolean"
}
const TypePersonVersion2 = {
  name: "string",
  gender: ["literal", "male", "female", "nonbinary", "unknown"]
}
const person = ensureType<PersonVersion2>(
  data,
  TypePersonVersion2,
  (value: unknown) => {
    if (isType<PersonVersion2>(value, TypePersonVersion2)) {
      return value
    }
    if (isType<PersonVersion1>(value, TypePersonVersion1)) {
      return {
        name: value.name,
        gender: value.female === true ? "female" : "unknown"
      }
    }
    return { name: "Anonymous", gender: "unknown" }
  }
)
```
