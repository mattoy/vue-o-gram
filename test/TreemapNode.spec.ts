import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TreemapNode from '../src/components/Treemap/TreemapNode.vue'
import { Direction, InternalNode, LeafNode } from '../src/components/Treemap/models'

type TestData = { label:string, weight: number }

describe('TreemapNode leaf', () => {
	test('is  displayed', async () => {
		const testLeaf = new LeafNode({ label: "#1", weight: 1 })
		const wrapper = mount<any, TestData>(TreemapNode, {
			props: {
				node: testLeaf                 
			}
		})

		const leaf = wrapper.find('span')
		const numberOfChildren = leaf.findAll('span').length


		expect(leaf.exists()).toBe(true)
		expect(numberOfChildren).toBe(0)

		// assert absence of flex direction in leaf
		const flexDirection = leaf.element.style.flexDirection
		const flexGrow = leaf.element.style.flexGrow
		expect(flexDirection).toBeFalsy()
		expect(flexGrow).toBeTruthy()
	})

	test('with custom slot is displayed with label', async () => {
		const testLeaf = new LeafNode({ label: "#1", weight: 1 })
		const wrapper = mount<any, TestData>(TreemapNode, {
			props: { node: testLeaf },
			slots: { default: '{{ params.content.label }}' }
		})

		const displayElement = wrapper.find('span')
		const flexGrow = displayElement.element.style.flexGrow

		expect(displayElement.text()).toBe("#1")
	})
})

describe('Two leaf TreemapNode', () => {
	test('is displayed with right sizing', async () => {
		const testLeaf = new InternalNode([new LeafNode({ weight: 3 }), new LeafNode({ weight: 2 })], Direction.row)
		const wrapper = mount<any, TestData>(TreemapNode, {
			props: {
				node: testLeaf                 
			}
		})

		const internalNode = wrapper.find('div')
		const numberOfChildren = internalNode.findAll('span').length
		const firstChild = internalNode.find('span')
		const secondChild = internalNode.findAll('span')[1]
		const proportion = Number(firstChild.element.style.flexGrow) / Number(secondChild.element.style.flexGrow)
		const direction = internalNode.element.style.flexDirection

		expect(internalNode.exists()).toBe(true)
		expect(numberOfChildren).toBe(2)
		expect(proportion).toBeCloseTo(3/2)
		expect(direction).toBe('row')
	})

	test('is displayed as column', async () => {
		const testLeaf = new InternalNode([new LeafNode({ weight: 3 }), new LeafNode({ weight: 2 })], Direction.column)
		const wrapper = mount<any, TestData>(TreemapNode, {
			props: {
				node: testLeaf                 
			}
		})

		const internalNode = wrapper.find('div')
		const direction = internalNode.element.style.flexDirection

		console.log(wrapper.html());

		expect(direction).toBe('column')
	})
})