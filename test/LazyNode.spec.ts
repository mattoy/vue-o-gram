import { describe, test, expect } from 'vitest'
import { LazyNode, LeafNode } from "../src/components/Treemap/models";


describe('LazyNode', () => {
	test('Is lazy', () => {
	  const testNode = new LazyNode([new LeafNode({ weight: 1 })], 1)
	  expect(testNode.children.length).toBe(0)
	  expect(testNode.lazyContent.length).toBe(1)
	})
  
  })