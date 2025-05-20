import { describe, test, expect } from 'vitest'
import { NestedArray, nestedReduce } from '../src/components/Treemap/interfaces/NestedArray'
import { Direction, Node, LeafNode, Rectangle, InternalNode } from '../src/components/Treemap/models'
import { preProcess, squarify, weightReducer } from '../src/components/Treemap/models/Squarified'

describe('Flat nested Nodes', () => {
  test('sum to their weights', () => {
    const flatArray: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 10 }),
        new LeafNode({ weight: 6 }),
        new LeafNode({ weight: 3 }),
        new LeafNode({ weight: 3 }),
        new LeafNode({ weight: 2 }),
    ]
    expect(nestedReduce(flatArray, weightReducer, 0)).toBe(24)
  })

  test('Add initial value', () => {
    const flatArray: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 10 })
    ]
    expect(nestedReduce(flatArray, weightReducer, 5)).toBe(15)
  })

  test('is commutative', () => {
    const flatArrayA: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 18 }),
        new LeafNode({ weight: 10 }),
        new LeafNode({ weight: 4 })
    ]

    const flatArrayB: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 10 }),
        new LeafNode({ weight: 4 }),
        new LeafNode({ weight: 18 })
    ]
    expect(nestedReduce(flatArrayA, weightReducer, 0))
        .toEqual(nestedReduce(flatArrayB, weightReducer, 0))
  })
})

describe('Nested Nodes', () => {
  test('sum to their weights', () => {
    const nestedArray: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 10 }),
        new LeafNode({ weight: 6 }),
        [
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 3 }),
          [
            new LeafNode({ weight: 1 }),
            new LeafNode({ weight: 1 })
          ]
        ],
        new LeafNode({ weight: 2 }),
    ]
    expect(nestedReduce(nestedArray, weightReducer, 0)).toBe(26)
  })
})

describe('Treemap in wide rectangle', () => {
  test('is arranged in columns', () => {
    
    const items = [
      new LeafNode({ weight: 3 }),
      new LeafNode({ weight: 3 })
    ]

    const rectangle = new Rectangle(200, 100)

    const treemap = squarify(items, null, rectangle)
    
    expect(treemap.direction).toBe(Direction.row)
  })
})

describe('Treemap in high rectangle', () => {
  test('is arranged in rows', () => {
    
    const items = [
      new LeafNode({ weight: 3 }),
      new LeafNode({ weight: 3 })
    ]

    const rectangle = new Rectangle(100, 200)

    const treemap = squarify(items, null, rectangle)
                
    expect(treemap.direction).toBe(Direction.column)
  })
})

describe('Example Treemap', () => {
  test('squarifies correctly', () => { 
    const input: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 6 }),
        new LeafNode({ weight: 6 }),
        new LeafNode({ weight: 4 }),
        new LeafNode({ weight: 3 }),
        new LeafNode({ weight: 2 }),
        new LeafNode({ weight: 2 }),
        new LeafNode({ weight: 1 }),
    ]
    const rectangle = new Rectangle(600, 400)
    const squarifiedTreemap = squarify(input, null, rectangle)

    const expectedResult = new InternalNode([
      new InternalNode([
        new LeafNode({ weight: 6 }),
        new LeafNode({ weight: 6 })
      ], Direction.column),
      new InternalNode([
        new InternalNode([
          new LeafNode({ weight: 4 }),
          new LeafNode({ weight: 3 })
        ], Direction.row),
        new InternalNode([
          new InternalNode([
            new LeafNode({ weight: 2 })
          ], Direction.column),
          new InternalNode([
            new LeafNode({ weight: 2 }),
            new LeafNode({ weight: 1 })
          ], Direction.row)
        ], Direction.row)
      ], Direction.column)
    ], Direction.row)

    expect(squarifiedTreemap).toEqual(expectedResult)
  })
})

describe('Nested Treemap', () => {
  test('squarifies without error', () => { 
    const nestedArray: NestedArray<Node<any>>[] = [
        new LeafNode({ weight: 10 }),
        new LeafNode({ weight: 6 }),
        [
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 3 }),
          [
            new LeafNode({ weight: 1 }),
            new LeafNode({ weight: 1 })
          ]
        ],
        new LeafNode({ weight: 2 }),
    ]
    const rectangle = new Rectangle(200, 200)
    const squarifiedTreemap = squarify(nestedArray, null, rectangle)
    expect(squarifiedTreemap.children).toHaveLength(2) // TODO: improve expectation
  })

  test('Subtreemaps squarified', () => { 
    const nestedArray: NestedArray<Node<any>>[] = [
        [
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 1 })
        ],
        [
          new LeafNode({ weight: 5 }),
          new LeafNode({ weight: 1 })
        ],
        new LeafNode({ weight: 2 })
    ]
    const rectangle = new Rectangle(200, 300)
    const squarifiedTreemap = squarify(nestedArray, null, rectangle)

    const expectedTreemap = new InternalNode([
      new InternalNode([
        new InternalNode([ // Maybe get rid of this redundant internal node 
          new InternalNode([
            new LeafNode({ weight: 3 })
          ], Direction.column),
          new InternalNode([
            new LeafNode({ weight: 3 }),
            new LeafNode({ weight: 1 })
          ], Direction.column),
        ], Direction.row),
      ], Direction.row),
      new InternalNode([
        new InternalNode([
          new LeafNode({ weight: 5 }),
          new LeafNode({ weight: 1 })
        ], Direction.column),
        new LeafNode({ weight: 2 })
      ], Direction.row)
    ], Direction.column)

    expect(squarifiedTreemap).toEqual(expectedTreemap)
  })

  test('Subtreemaps column squarified', () => { 
    const nestedArray: NestedArray<Node<any>>[] = [
        [
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 3 }),
          new LeafNode({ weight: 1 })
        ],
        [
          new LeafNode({ weight: 5 }),
          new LeafNode({ weight: 1 })
        ],
        new LeafNode({ weight: 2 })
    ]
    const rectangle = new Rectangle(300, 200)
    const squarifiedTreemap = squarify(nestedArray, null, rectangle)

    const expectedTreemap = new InternalNode([
      new InternalNode([
        new InternalNode([
          new InternalNode([
            new LeafNode({ weight: 3 })
          ], Direction.row),
          new InternalNode([
            new LeafNode({ weight: 3 }),
            new LeafNode({ weight: 1 })
          ], Direction.row),
        ], Direction.column),
      ], Direction.column),
      new InternalNode([
        new InternalNode([
          new LeafNode({ weight: 5 }),
          new LeafNode({ weight: 1 })
        ], Direction.row),
        new LeafNode({ weight: 2 })
      ], Direction.column)
    ], Direction.row)

    expect(squarifiedTreemap).toEqual(expectedTreemap)
  })


  test('Subtreemaps minimal', () => { 
    const nestedArray: NestedArray<Node<any>>[] = [
        [
          new LeafNode({ weight: 2 }),
          new LeafNode({ weight: 1 })
        ]
    ]
    const rectangle = new Rectangle(200, 300)
    const squarifiedTreemap = squarify(nestedArray, null, rectangle)

    const expectedTreemap = new InternalNode([
      new InternalNode([
        new LeafNode({ weight: 2 }),
        new LeafNode({ weight: 1 })
      ], Direction.column)
    ], Direction.row)

    expect(squarifiedTreemap).toEqual(expectedTreemap)
  })
})



describe('Nonsensical data', () => {
  test('empty data', () => { 
    const data: NestedArray<Node<any>>[] = []
    const rectangle = new Rectangle(200, 100)
    expect(squarify(data, null, rectangle).weight).toEqual(0)
    expect(squarify(data, null, rectangle).children.length).toEqual(0)
  })
  test('single element', () => { 
    const data: NestedArray<Node<any>>[] = [new LeafNode({ weight: 10 })]
    const rectangle = new Rectangle(200, 100)

    const expectedResult = new InternalNode([
      new LeafNode({ weight: 10 })
    ], Direction.column)
    expect(squarify(data, null, rectangle)).toEqual(expectedResult)
  })
})

describe('Warning', () => {
  test('Aspect ratios equal', () => { 
    const data: NestedArray<Node<any>>[] = [
      new LeafNode({ weight: 1 }),
      new LeafNode({ weight: 1 }),
      new LeafNode({ weight: 2 })]
    const rectangle = new Rectangle(200, 100)

    const expectedResult = new InternalNode([
      new InternalNode([
        new LeafNode({ weight: 1 })
      ], Direction.column),
      new InternalNode([
        new LeafNode({ weight: 1 }),
        new LeafNode({ weight: 2 })
      ], Direction.row)
    ], Direction.row)

    expect(squarify(data, null, rectangle)).toEqual(expectedResult)
  })
})

describe('Unordered inputs', () => {
  test('preprocessing', () => {
    const preprocessedData = preProcess([{ weight: 1 }, { weight: 6 }, { weight: 2 }, { weight: 3 }])
    const descendingOrder = [
      new LeafNode({ weight: 6 }),
      new LeafNode({ weight: 3 }),
      new LeafNode({ weight: 2 }),
      new LeafNode({ weight: 1 })
    ]

    expect(preprocessedData).toEqual(descendingOrder)
  })
})

describe('Single object input', () => {
  test('preprocessing', () => {
    const preprocessedData = preProcess({ weight: 1 })
    const arrayStructure = [
      new LeafNode({ weight: 1 })
    ]

    expect(preprocessedData).toEqual(arrayStructure)
  })
})

// describe('Nested structures', () => {
//   test('Should resolve all lazy nodes', () => {
//     const data: NestedArray<Node<any>>[] = [
//       new LeafNode({ weight: 1 }),
//       new LeafNode({ weight: 1 }),
//       new LeafNode({ weight: 2 }),]
//   })
// })