import { TypeDef, assertType, ensureType } from "."

describe("@tolokoban/type-guards", () => {
    describe("assertType()", () => {
        const itShouldThrow = (data: unknown, type: TypeDef) => {
            it(`should throw for ${JSON.stringify(data)} with ${JSON.stringify(
                type
            )}`, () => {
                expect(() => assertType(data, type)).toThrow()
            })
        }
        const itShouldNotThrow = (data: unknown, type: TypeDef) => {
            it(`should NOT throw for ${JSON.stringify(
                data
            )} with ${JSON.stringify(type)}`, () => {
                expect(() => assertType(data, type)).not.toThrow()
            })
        }
        describe(`"boolean"`, () => {
            itShouldNotThrow(true, "boolean")
            itShouldNotThrow(false, "boolean")
            itShouldThrow(1, "boolean")
            itShouldThrow(0, "boolean")
        })
        describe(`"number"`, () => {
            itShouldNotThrow(3.14, "number")
            itShouldThrow("3.14", "number")
        })
        describe(`"string"`, () => {
            itShouldNotThrow("Hello", "string")
            itShouldNotThrow("", "string")
            itShouldThrow(3.14, "string")
        })
        describe(`"null"`, () => {
            itShouldNotThrow(null, "null")
            itShouldThrow(undefined, "null")
        })
        describe(`"undefined"`, () => {
            itShouldNotThrow(undefined, "undefined")
            itShouldThrow(null, "undefined")
        })
        describe(`["tuples", ...]`, () => {
            itShouldNotThrow([6, 8], ["tuple", "number", "number"])
            itShouldNotThrow(
                [6, "six", 8, "eight"],
                ["tuple", "number", "string", "number", "string"]
            )
            itShouldThrow(
                [6, "six", 8],
                ["tuple", "number", "string", "number", "string"]
            )
            itShouldThrow(
                ["six", 6, "eight", 8],
                ["tuple", "number", "string", "number", "string"]
            )
        })
        describe(`{...}`, () => {
            itShouldThrow({}, { name: "string" })
            itShouldNotThrow({ name: "Paula" }, { name: "string" })
            itShouldThrow({ name: 666 }, { name: "string" })
            itShouldThrow({ name: "Martha" }, { name: "string", age: "number" })
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
            itShouldThrow({ name: 666 }, [
                "partial",
                {
                    name: "string",
                },
            ])
        })
        describe(`["literal", ...]`, () => {
            itShouldNotThrow("cherry", [
                "literal",
                "ananas",
                "banaba",
                "cherry",
                "dattes",
            ])
            itShouldThrow("prout", [
                "literal",
                "ananas",
                "banaba",
                "cherry",
                "dattes",
            ])
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
