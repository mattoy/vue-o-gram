import { Direction } from "./Direction"

/**
 * Describes the size of a rectangle
 */
export class Rectangle {
	readonly width: number
	readonly height: number

	constructor(width: number, height: number) {
		this.width = width
		this.height = height
	}

	static from(domRect: DOMRect): Rectangle {
		return new Rectangle(domRect.width, domRect.height)
	}

	get area(): number {
		return this.width * this.height
	}

	get shorterSide(): number {
		return Math.min(this.width, this.height)
	}

	get isWiderThanTall(): boolean {
		return (this.width > this.height)
	}

	/**
	 * Get a part of the rectangle
	 * @param ratio The percentage of area that should be split
	 * @param direction The dimension the split should cut
	 * @returns Part of the rectangle
	 */
	portion(ratio: number, direction: Direction): Rectangle {
		switch(direction) {
			case Direction.row:				
				return new Rectangle(this.width, this.height * ratio)
			case Direction.column:				
				return new Rectangle(this.width * ratio, this.height)
		}
	}

	/**
	 * Removes a part of the rectanlge
	 * @param ratio The percentage of area that should be removed
	 * @param direction The dimension the split should cut
	 * @returns Rectangle without the removed part
	 */
	shaving(ratio: number, direction: Direction): Rectangle {
		switch(direction) {
			case Direction.row:				
				return new Rectangle(this.width, this.height * (1 - ratio))
			case Direction.column:				
				return new Rectangle(this.width * (1 - ratio), this.height)
		}
	}
}