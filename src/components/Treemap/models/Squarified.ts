import { NestedArray, nestedMap, nestedReduce, nestedSort } from "../interfaces/NestedArray"
import { Direction } from "./Direction"
import { LazyNode } from "./LazyNode"
import { Rectangle } from "./Rectangle"
import { Node, InternalNode, LeafNode } from "./Node"
import { ContentType } from "../interfaces/ContentType"

/** 
 * Structures the given items in a treemap recursively with the "squarify" algorithm
 * 
 * @param items Items that are not yet layed out
 * @param currentNode Already layed out treemap
 * @param enclosingRectangle The rectangle in which the treemap should be layed out
 * 
 * @returns Root node for the squarified treemap
 */
export function squarify<T extends ContentType>(items: NestedArray<Node<T>>[], currentNode: InternalNode<T>|null, enclosingRectangle: Rectangle): InternalNode<T> {
	if (items.length === 0) {
		return new InternalNode([], Direction.column, 0)
	} 

	const [firstItem, ...remainingItems] = items	
	const firstNode = firstItem instanceof Node ? firstItem : subtree(firstItem);

	if(currentNode === null) { // No items added to this sub-treemap yet		
		return initializeTreemap<T>(enclosingRectangle, firstNode, remainingItems)
	}

	const candidateNode = currentNode.inserting(firstNode)

	if(items.length === 1) { // if only one left, just add it, no new treemap necessary for the last item 
		const newDirection = enclosingRectangle.isWiderThanTall ? Direction.row : Direction.column // align the last subtreemap with the long side instead of the sort
		const result = candidateNode.oriented(newDirection)
		return resolved(result, enclosingRectangle)
	}

	const allItemsWeight = nestedReduce(items, weightReducer, currentNode.weight)

	const currentWeightShare = currentNode.weight / allItemsWeight
	const currentTargetRectangle = enclosingRectangle.portion(currentWeightShare, currentNode.direction)
	const currentWorstAspectRatio = currentNode.worstAspectRatio(currentTargetRectangle)

	const candidateWeightShare = candidateNode.weight / allItemsWeight
	const candidateTargetRectangle = enclosingRectangle.portion(candidateWeightShare, candidateNode.direction)
	const candidateWorstAspectRatio = candidateNode.worstAspectRatio(candidateTargetRectangle)	

	if(candidateWorstAspectRatio < currentWorstAspectRatio) { // adding another item is better (smaller aspect ratio)
		return squarify(remainingItems, candidateNode, enclosingRectangle)
	}
	
	// adding another item is not worth it
	const remainingRectangle = enclosingRectangle.shaving(currentWeightShare, currentNode.direction)
	const remainingTreemap = squarify(items, null, remainingRectangle)
	
	const resultingDirection = (currentNode.direction == Direction.row) ? Direction.column : Direction.row
	const resolvedNode: InternalNode<T> = resolved(currentNode, currentTargetRectangle)
	
	// New root with current treemap and remaining treemap
	return new InternalNode([resolvedNode, remainingTreemap], resultingDirection)
}

function initializeTreemap<T extends ContentType>(enclosingRectangle: Rectangle, firstNode: Node<T>, remainingItems: NestedArray<Node<T>>[]) {
	const newDirection = enclosingRectangle.isWiderThanTall ? Direction.column : Direction.row // Align on short side (column on the left or row at the top)		
	const newNode = new InternalNode([firstNode], newDirection)
	return remainingItems.length > 0 ? 
		squarify(remainingItems, newNode, enclosingRectangle) : 
		resolved(newNode, enclosingRectangle)
}


function subtree(firstItem: NestedArray<Node<ContentType>>[]): LazyNode<ContentType> {
	// create a complete sub-treemap
	const subTreeWeight = nestedReduce(firstItem, weightReducer, 0)
	return new LazyNode(firstItem, subTreeWeight)
}

export function weightReducer(sum: number, current: Node<ContentType>): number {
	return sum + current.weight
}

function resolved<T extends ContentType>(currentNode: InternalNode<T>, targetRectangle: Rectangle): InternalNode<T> {	
	const resultingDirection = (currentNode.direction == Direction.row) ? Direction.column : Direction.row

	// squarify lazy children
	return currentNode.children.reduce((resolvedNode: InternalNode<T>, child) => {
		if(child instanceof LazyNode) {
			const subTreeWeightShare = child.weight / currentNode.weight
			const subTreeRectangle = targetRectangle.portion(subTreeWeightShare, resultingDirection)				
			const subTree = squarify(child.lazyContent, null, subTreeRectangle)
			return resolvedNode.inserting(subTree)
		} else {
			return resolvedNode.inserting(child)
		}
	}, new InternalNode([], currentNode.direction))
}

export function preProcess<Content extends ContentType>(inputArray: NestedArray<Content>): NestedArray<Node<Content>>[] {
	// Wrap input objects in Nodes
	const temporarayItems = nestedMap(inputArray, (item) => {
		return new LeafNode<Content>(item)
	})

	// Make sure NestedArray is an array
	let items: NestedArray<Node<Content>>[]
	if(temporarayItems instanceof Node) {
		const singleItem = temporarayItems
		items = [singleItem]
	} else {
		items = temporarayItems as NestedArray<Node<Content>>[]
	}

	// Decreasing order for best result
	const weightOf = (input: NestedArray<Node<Content>>) => nestedReduce(input, weightReducer , 0)
	const byWeightDescending = (a: NestedArray<Node<Content>>, b: NestedArray<Node<Content>>) => weightOf(b) - weightOf(a)
	const sortedItems = nestedSort(items, byWeightDescending) as NestedArray<Node<Content>>[]

	return sortedItems
}