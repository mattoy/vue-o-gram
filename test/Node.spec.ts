import { describe, test, expect } from 'vitest'
import { InternalNode, LeafNode, Direction, Rectangle } from '../src/components/Treemap/models'


describe('A leaf node', () => {
  const testLeaf = new LeafNode({ weight: 1 })

  test('Checking for leaf property', () => {
    expect(testLeaf.isLeaf).toBeTruthy()
  })

  test('Adding children', () => {
    const testNode = testLeaf.inserting(new LeafNode({ weight: 1 }))

    expect(testNode.isLeaf).toBeFalsy()

    expect(testNode.children.length).toBe(1)
    expect(testNode.weight).toBe(1)
  })
})

describe('An internal node', () => {
  const testNode = new InternalNode([new LeafNode({ weight: 3 }), new LeafNode({ weight: 2 })], Direction.row)

  test('Checking for leaf property', () => {
    expect(testNode.isLeaf).toBeFalsy()

    expect(testNode.children.length).toBe(2)
    expect(testNode.weight).toBe(5)
  })

  test('Adding gets one more', () => {
    const resultingNode = testNode.inserting(new LeafNode({ weight: 1 }))
    expect(resultingNode.children.length).toBe(3)
  })
})

describe('A column oriented node', () => {
  const columnNode = new InternalNode([], Direction.column)

  test('Changing to row orientation', () => {
    const resultingNode = columnNode.oriented(Direction.row)
    expect(resultingNode.direction).toBe(Direction.row)
  })

  test('Changing to column orientation', () => {
    const resultingNode = columnNode.oriented(Direction.column)
    expect(resultingNode.direction).toBe(Direction.column)
  })

  test('Transposing orientation', () => {
    const resultingNode = columnNode.orientationTransposed()
    expect(resultingNode.direction).toBe(Direction.row)
  })
})

describe('A row oriented node', () => {
  const rowNode = new InternalNode([], Direction.row)

  test('Changing to row orientation', () => {
    const resultingNode = rowNode.oriented(Direction.row)
    expect(resultingNode.direction).toBe(Direction.row)
  })

  test('Changing to column orientation', () => {
    const resultingNode = rowNode.oriented(Direction.column)
    expect(resultingNode.direction).toBe(Direction.column)
  })

  test('Transposing orientation', () => {
    const resultingNode = rowNode.orientationTransposed()
    expect(resultingNode.direction).toBe(Direction.column)
  })
})

describe('A 3:1 distributed row', () => {
  const testNode = new InternalNode([new LeafNode({ weight: 3 }), new LeafNode({ weight: 1 })], Direction.row)
  const square = new Rectangle(10,10)
  const wideRectangle = new Rectangle(40,10)
  const narrowRectangle = new Rectangle(20,10)

  test('Calculating worst aspect ration in row', () => {
    expect(testNode.worstAspectRatio(square)).toBe(4)
    expect(testNode.worstAspectRatio(wideRectangle)).toBe(3)
    expect(testNode.worstAspectRatio(narrowRectangle)).toBe(2)
  })
})

describe('A 3:1 distributed column', () => {
  const testNode = new InternalNode([new LeafNode({ weight: 3 }), new LeafNode({ weight: 1 })], Direction.column)
  const square = new Rectangle(10,10)
  const tallRectangle = new Rectangle(10,40)
  const shallowRectangle = new Rectangle(10,20)

  test('Calculating worst aspect ration in column', () => {
    expect(testNode.worstAspectRatio(square)).toBe(4)
    expect(testNode.worstAspectRatio(tallRectangle)).toBe(3)
    expect(testNode.worstAspectRatio(shallowRectangle)).toBe(2)
  })
})