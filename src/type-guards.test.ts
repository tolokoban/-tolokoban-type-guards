import { TypeDef, assertType, ensureType } from "."

const isNeverMyType = (_data: unknown) => false

describe("@tolokoban/type-guards", () => {
    describe("assertType()", () => {
        const itShouldThrow = (
            data: unknown,
            type: TypeDef,
            expectedErrorMessage?: string
        ) => {
            it(`should throw for ${JSON.stringify(data)} with ${JSON.stringify(
                type
            )}`, () => {
                expect(() => assertType(data, type)).toThrow(
                    expectedErrorMessage
                )
            })
        }
        const itShouldNotThrow = (data: unknown, type: TypeDef) => {
            it(`should NOT throw for ${JSON.stringify(
                data
            )} with ${JSON.stringify(type)}`, () => {
                expect(() => assertType(data, type)).not.toThrow()
            })
        }
        describe(`"undefined"`, () => {
            itShouldNotThrow(undefined, "undefined")
            itShouldThrow(
                null,
                "undefined",
                "Expected data to be a undefined and not a null!"
            )
        })
        describe(`(data: unknown) => boolean`, () => {
            itShouldThrow(
                true,
                isNeverMyType,
                "Expected isNeverMyType(data) to return true!"
            )
        })
        describe(`"boolean"`, () => {
            itShouldNotThrow(true, "boolean")
            itShouldNotThrow(false, "boolean")
            itShouldThrow(
                1,
                "boolean",
                "Expected data to be a boolean and not a number!"
            )
            itShouldThrow(
                "1",
                "boolean",
                "Expected data to be a boolean and not a string!"
            )
        })
        describe(`"number"`, () => {
            itShouldNotThrow(3.14, "number")
            itShouldThrow(
                "3.14",
                "number",
                "Expected data to be a number and not a string!"
            )
        })
        describe(`"string"`, () => {
            itShouldNotThrow("Hello", "string")
            itShouldNotThrow("", "string")
            itShouldThrow(
                3.14,
                "string",
                "Expected data to be a string and not a number!"
            )
        })
        describe(`"null"`, () => {
            itShouldNotThrow(null, "null")
            itShouldThrow(
                undefined,
                "null",
                "Expected data to be a null and not a undefined!"
            )
            itShouldThrow(
                isNeverMyType,
                "null",
                "Expected data to be a null and not a function isNeverMyType()!"
            )
        })
        describe(`["tuples", ...]`, () => {
            itShouldNotThrow([6, 8], ["tuple", "number", "number"])
            itShouldNotThrow(
                [6, "six", 8, "eight"],
                ["tuple", "number", "string", "number", "string"]
            )
            itShouldThrow(
                [6, "six", 8],
                ["tuple", "number", "string", "number", "string"],
                "Expected data to have 4 elements, not 3!"
            )
            itShouldThrow(
                [6, "siz", "8", "eight"],
                ["tuple", "number", "string", "number", "string"],
                "Expected data[2] to be a number and not a string!"
            )
        })
        describe(`{...}`, () => {
            itShouldThrow({}, { name: "string" })
            itShouldNotThrow({ name: "Paula" }, { name: "string" })
            itShouldThrow(
                { name: 666 },
                { name: "string" },
                "Expected data.name to be a string and not a number!"
            )
            itShouldThrow(
                { name: "Martha" },
                { name: "string", age: "number" },
                "Expected data.age to be a number and not a undefined!"
            )
        })
        describe(`["partial", {...}]`, () => {
            itShouldNotThrow({}, [
                "partial",
                {
                    name: "string",
                },
            ])
            itShouldNotThrow({ name: "William" }, [
                "partial",
                {
                    name: "string",
                    age: "number",
                },
            ])
            itShouldNotThrow({ age: 21 }, [
                "partial",
                {
                    name: "string",
                },
            ])
            itShouldThrow(
                { name: 666 },
                [
                    "partial",
                    {
                        name: "string",
                    },
                ],
                "Expected data.name to be a string and not a number!"
            )
        })
        describe(`["literal", ...]`, () => {
            itShouldNotThrow("cherry", [
                "literal",
                "ananas",
                "banaba",
                "cherry",
                "dattes",
            ])
            itShouldThrow(
                "prout",
                ["literal", "ananas", "banaba", "cherry", "dattes"],
                'Expected data to be a literal ("ananas" | "banaba" | "cherry" | "dattes") and not a string!'
            )
        })
    })
    describe("ensureType()", () => {
        describe("defaultValue", () => {
            it(`should return the value`, () => {
                expect(ensureType(true, "boolean", 666)).toBe(true)
            })
            it(`should return defaultValue`, () => {
                expect(ensureType<number>("Blob", "number", 666)).toBe(666)
            })
            it(`should convert old version`, () => {
                expect(
                    ensureType("true", "boolean", v => {
                        if (v === "true") return true
                        return false
                    })
                ).toBe(true)
            })
        })
    })
})
