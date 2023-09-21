# @tolokoban/type-guards

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
