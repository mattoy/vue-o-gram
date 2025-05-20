import { ContentType } from "../interfaces/ContentType"
import { NestedArray } from "../interfaces/NestedArray"
import { Direction } from "./Direction"
import { InternalNode, Node } from './Node'

/**
 * A Node with an unresolved subtree. It contains a NodePile instead of regular children.
 */
export class LazyNode<Content extends ContentType> extends InternalNode<Content> {
	readonly lazyContent: NestedArray<Node<Content>>[]
	constructor(children: NestedArray<Node<Content>>[], weight: number) {
		super([], Direction.row, weight)
		this.lazyContent = children
	}
}