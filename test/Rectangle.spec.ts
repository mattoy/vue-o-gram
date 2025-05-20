import { describe, test, expect } from 'vitest'
import { Rectangle, Direction } from '../src/components/Treemap/models'

describe('Rectangle construction', () => {
  test('results in correct dimensions', () => {
    const testRectangle = new Rectangle(7, 4)
    expect(testRectangle.width).toBe(7)
    expect(testRectangle.height).toBe(4)
  })
})

describe('Rectangle area', () => {
  test('is product of sides', () => {
    const testRectangle = new Rectangle(4, 4)
    expect(testRectangle.area).toBe(16)
  })

  test('is product of sides', () => {
    const testRectangle = new Rectangle(2, 4)
    expect(testRectangle.area).toBe(8)
  })

  test('is product of sides', () => {
    const testRectangle = new Rectangle(4, 2)
    expect(testRectangle.area).toBe(8)
  })
})

describe('Rectangle shorter side', () => {
  test('is height', () => {
    const testRectangle = new Rectangle(5, 4)
    expect(testRectangle.shorterSide).toBe(4)
  })

  test('is width', () => {
    const testRectangle = new Rectangle(5, 6)
    expect(testRectangle.shorterSide).toBe(5)
  })

  test("doesn't matter in square", () => {
    const testRectangle = new Rectangle(5, 5)
    expect(testRectangle.shorterSide).toBe(5)
  })
})

describe('Rectangle is', () => {
  test('wider than tall', () => {
    const testRectangle = new Rectangle(6, 5)
    expect(testRectangle.isWiderThanTall).toBe(true)
  })

  test('taller than wide', () => {
    const testRectangle = new Rectangle(5, 6)
    expect(testRectangle.isWiderThanTall).toBe(false)
  })

  test('square is not wider than tall', () => {
    const testRectangle = new Rectangle(2, 2)
    expect(testRectangle.isWiderThanTall).toBe(false)
  })
})

describe('Portion', () => {
  test('is from horizontal cut', () => {
    const testRectangle = new Rectangle(5, 6)
    expect(testRectangle.portion(0.5, Direction.row)).toEqual(new Rectangle(5, 3))
  })

  test('is from vertical cut', () => {
    const testRectangle = new Rectangle(10, 10)
    const resultRectangle = new Rectangle(8, 10)
    expect(testRectangle.portion(0.8, Direction.column).width).toBeCloseTo(resultRectangle.width)
    expect(testRectangle.portion(0.8, Direction.column).height).toBeCloseTo(resultRectangle.height)
  })
})

describe('Shave', () => {
  test('is from horizontal cut', () => {
    const testRectangle = new Rectangle(5, 6)
    expect(testRectangle.shaving(0.5, Direction.row)).toEqual(new Rectangle(5, 3))
  })

  test('is from vertical cut', () => {
    const testRectangle = new Rectangle(10, 10)
    const resultRectangle = new Rectangle(2, 10)
    expect(testRectangle.shaving(0.8, Direction.column).width).toBeCloseTo(resultRectangle.width)
    expect(testRectangle.shaving(0.8, Direction.column).height).toBeCloseTo(resultRectangle.height)
  })
})