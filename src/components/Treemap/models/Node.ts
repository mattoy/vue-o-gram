import { ContentType } from '../interfaces/ContentType'
import { Direction } from './Direction'
import { Rectangle } from './Rectangle'

type AspectRatio = number

/**
 * A node of a treemap that is a treemap itself
 */
export class Node<Content extends ContentType> {
	readonly weight: number

	protected constructor(weight: number) {
		this.weight = weight
	}

	/**
	 * Adding a Node to the children
	 * @param child Node to insert
	 * @returns A copy of the Node that contains the child Node
	 */
	inserting(child: Node<Content>): InternalNode<Content> {
		if (this instanceof InternalNode) {
			return new InternalNode(this.children.concat(child), this.direction)
		} else {
			return new InternalNode([child], Direction.row) // row is magic default
		}
	}

	/**
	 * Whether a Node is a leaf, meaning it has no children
	 */
	get isLeaf(): boolean {
		return (this instanceof LeafNode)
	}

	// --- Convenience methods
	/**
	 * Returns an root node that contains the node
	 */
	// wrapInRoot(direction: Direction): InternalNode<Content> {
	// 	return new InternalNode([this], Direction.row)
	// }
}

export class LeafNode<Content extends ContentType> extends Node<Content> {
	readonly content: Content

	constructor(content: Content) {
		super(content.weight)
		this.content = content
	}
}

export class InternalNode<Content extends ContentType> extends Node<Content> {
	readonly children: readonly Node<Content>[]
	readonly direction: Direction

	constructor(children: readonly Node<Content>[], direction: Direction, weight?: number) {
		super(weight ?? children.reduce((sum, current) => sum + current.weight, 0))
		this.children = children
		this.direction = direction
	}

	/**
	 * Get a Node that groups its children in a new direction
	 * @param direction New direction the Node should group it's children
	 * @returns Node with the new direction
	 */
	oriented(direction: Direction): InternalNode<Content> {
		return new InternalNode(this.children, direction)
	}

	/**
	 * Get a Node with transposed direction
	 * @returns Node with the direction transposed
	 */
	orientationTransposed(): InternalNode<Content> {
		return this.oriented(this.direction == Direction.row ? Direction.column : Direction.row)
	}

	/**
	 * Determines the squareness of a treemap if it's layed out in a given area.
	 * @param rectangle A rectangle in which the aspect ratios are measured
	 * @returns The children's aspect ratio that is furthest from 1 
	 */
	worstAspectRatio(rectangle: Rectangle): AspectRatio {
		const flexibleSide = (this.direction == Direction.row) ? rectangle.height : rectangle.width
		const layoutSide = (this.direction == Direction.row) ? rectangle.width : rectangle.height
		
		const aspectRatios: readonly AspectRatio[] = this.children
			.map(child => {
				const elementSpan = layoutSide * child.weight / this.weight
				const aspectRatio = Math.max(elementSpan/flexibleSide, flexibleSide/elementSpan)
				return aspectRatio
			})
		const worstAspectRatio: AspectRatio = Math.max( ... aspectRatios )

		return worstAspectRatio
	}
}