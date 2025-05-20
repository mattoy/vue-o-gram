import { describe, test, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Treemap from '../src/components/Treemap'

type TestData = {label:string, weight: number}

describe('Treemap', () => {
	type TestData = {label:string, weight: number}

	test('is fully displayed', async () => {
		global.document.querySelector = vi.fn(() => ({
            getBoundingClientRect: vi.fn( function() {
                return { 
					width: 600, 
					height: 400 
				}
            })
        }))

		
		const wrapper = mount<any, TestData>(Treemap, {
			props: {
				items: [
					{
						"label": "6",
						"weight": 6
					},
					{
						"label": "6",
						"weight": 6
					},
					{
						"label": "4",
						"weight": 4
					},
					{
						"label": "3",
						"weight": 3
					},
					{
						"label": "2",
						"weight": 2
					},
					{
						"label": "2",
						"weight": 2
					},
					{
						"label": "1",
						"weight": 1
					}
				]
			}
		})
		
		const treemap = wrapper.find('div#treemap')

		expect(treemap.exists()).toBe(true)

		await wrapper.vm.$nextTick() // Treemap initializes in second tick

		const anyNode = wrapper.find('span')
		expect(anyNode.exists()).toBe(true)

		const allStrongElements = treemap.findAll('strong')
		const testItems = allStrongElements.map((item)=>item.text())
		expect(testItems).toEqual(['6','6','4','3','2','2','1'])
	})

	test('with nested data', () => {
		const wrapper = mount<any, TestData>(Treemap, {
			props: {
				items: [
					{
						"label": "6",
						"weight": 6
					},
					[
						{
						"label": "3",
						"weight": 3
						},
						{
							"label": "3",
							"weight": 3
						}
					]
				]
			}
		})
		
		// TODO: expectation
	})
})

// Given a Treemap component with the following items:
//   | id | weight |
//   | 1  | 10     |
//   | 2  | 20     |
// When the component is rendered
// Then two Treemap nodes should be displayed
// And the nodes should have the corresponding weights
describe('A simple Treemap', () => {
	test('the component is rendered', async () => {
		const wrapper = mount<any, TestData>(Treemap, {
			props: {
				items: [
					{ "label": "1", "weight": 10 },
					{ "label": "2", "weight": 20 }
				]
			}
		})

		await wrapper.vm.$nextTick()

		const displayedNodes = wrapper.findAll(".defaultStyle")
		const numberOfNodes = displayedNodes.length

		expect(numberOfNodes).toBe(2)

		const weights = displayedNodes.map((item) => item.get("strong").text())

		expect(weights).toEqual(["20","10"])
	})
})


// Given a Treemap component with empty items
// When the component is rendered
// Then no Treemap nodes should be displayed
describe('A Treemap component with empty items', () => {
	test('the component is rendered', async () => {
		const wrapper = mount<any, TestData>(Treemap, {
			props: { items: [] }
		})

		await wrapper.vm.$nextTick()

		const displayedNodes = wrapper.findAll(".defaultStyle")
		const numberOfNodes = displayedNodes.length

		expect(numberOfNodes).toBe(0)
	})
})

// Given a Treemap component with initial dimensions of 500x300 pixels
// When the container size is changed to 800x600 pixels
// Then the "templateRectangle" dimensions should update to 800x600 pixels
// And the Treemap nodes should be recalculated to fit the new dimensions


// Given a Treemap component with the following items:
//   | id | weight |
//   | 1  | 15     |
// And a custom slot displaying the "weight" of each node
// When the component is rendered
// Then the custom slot should display the weight "15" for the node

describe('A Treemap with a custom slot', () => {
	test('the component is rendered', async () => {
		const wrapper = mount<any, TestData>(Treemap, {
			props: { items: [{ "label": "1", "weight": 15 }] },
			slots: { default: '{{ params.content.weight }}' }
		})

		await wrapper.vm.$nextTick()
		const displayedNode = wrapper.find('span')
		expect(displayedNode.text()).toBe("15")
	})
})

// Given a Treemap component with a rectangular container of 400x400 pixels
// And the following items:
//   | id | weight |
//   | 1  | 50     |
//   | 2  | 50     |
// When the Treemap nodes are calculated
// Then each node should take up 50% of the container's area