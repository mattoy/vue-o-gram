import { describe, test, expect } from 'vitest'
import { NestedArray, nestedMap, nestedReduce, nestedSort } from "../src/components/Treemap/interfaces/NestedArray";

describe('Nested Array mapping', () => {
	test('adds one', () => {
        const nestedArray: NestedArray<number> = [5, 3, 8, 22, 11, 11, [4, 9, 1], 1, [0]]
        
        const transformer = (element: number) => {
            return element + 1
        }
        const mapped = nestedMap(nestedArray, transformer)

        expect(mapped).toEqual([6, 4, 9, 23, 12, 12, [5, 10, 2], 2, [1]])
	})
  
})

describe('Nested Array reducing', () => {
	test('Summs numbers', () => {
        const nestedArray: NestedArray<number> = [5, 3, 8, 22, 11, 11, [4, 9, 1], 1, [0]]
        
        const summing = (sum: number, increment: number) => {
            return sum + increment
        }
        const total = nestedReduce(nestedArray, summing, 0)

        expect(total).toBe(75)
	})
})

describe('Nested Array sorting', () => {
	test('sorts', () => {
        const nestedArray: NestedArray<number> = [5, 3, 8, 22, 11, 11, [4, 9, 1], 1, [0]]
        const summing = (sum: number, increment: number) => {
            return sum + increment
        }
        const lowToHigh = (a:NestedArray<number>, b:NestedArray<number>)=> { 
            return nestedReduce(a, summing, 0) - nestedReduce(b, summing, 0) 
        }
        
        const actualResult = nestedSort(nestedArray, lowToHigh)
        const expectedResult: NestedArray<number> = [[0], 1, 3, 5, 8, 11, 11, [1, 4, 9], 22]

        expect(actualResult).toStrictEqual(expectedResult)
	})
})