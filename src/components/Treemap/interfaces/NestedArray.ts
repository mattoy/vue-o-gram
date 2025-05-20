export type NestedArray<Element> = Element | NestedArray<Element>[]

export function nestedMap<T, U>(nestedArray: NestedArray<T>, transfomer: (input: T)=>U): NestedArray<U> {
    if(Array.isArray(nestedArray)) {
		return nestedArray.map((value) => {
            return nestedMap(value, transfomer)
        })
	} else {
        return transfomer(nestedArray as T)
	}
}

export function nestedSort<T>(nestedArray: NestedArray<T>, comparator: (a: NestedArray<T>, b: NestedArray<T>) => number): NestedArray<T> {
    if(Array.isArray(nestedArray)) {
		return nestedArray.toSorted(comparator)
				          .map((value) => nestedSort(value, comparator))
	} else {
		return nestedArray
	}
}

export function nestedReduce<T, U>(nestedArray: NestedArray<T>, reducer: (accumulator: U, currentValue: T) => U, initialValue: U): U {
	if(Array.isArray(nestedArray)) {
		const arrayReducer = (accumulator: U, currentValue: NestedArray<T>) => {
			return nestedReduce(currentValue, reducer, accumulator)
		}
		return nestedArray.reduce(arrayReducer, initialValue)
	} else {
		return reducer(initialValue, nestedArray as T)
	}
}





// export interface NestedArray<Element> {
// 	// Recursive structure for nested arrays
// 	[index: number]: Element | NestedArray<Element>;
  
// 	// Method to map over the nested array
// 	nestedMap<U>(transformer: (input: Element) => U): NestedArray<U>;
  
// 	// Method to sort the nested array
// 	nestedSort(comparator: (a: Element, b: Element) => number): NestedArray<Element>;
  
// 	// Method to reduce the nested array
// 	nestedReduce<U>(reducer: (accumulator: U, currentValue: Element) => U, initialValue: U): U;
//   }
  
//   // Helper function to determine if a value is a NestedArray
//   function isNestedArray<Element>(value: any): value is NestedArray<Element> {
// 	return Array.isArray(value);
//   }
  
//   // Implementation of methods
//   export class NestedArray<Element> implements NestedArray<Element> {
// 	private data: (Element | NestedArray<Element>)[];
  
// 	constructor(data: (Element | NestedArray<Element>)[]) {
// 	  this.data = data;
// 	}
  
// 	nestedMap<U>(transformer: (input: Element) => U): NestedArray<U> {
// 	  const mapHelper = (nested: (Element | NestedArray<Element>)[]): (U | NestedArray<U>)[] => {
// 		return nested.map(value =>
// 		  isNestedArray(value)
// 			? new NestedArray(mapHelper(value as NestedArray<Element>[]))
// 			: transformer(value as Element)
// 		);
// 	  };
// 	  return new NestedArray(mapHelper(this.data));
// 	}
  
// 	nestedSort(comparator: (a: Element, b: Element) => number): NestedArray<Element> {
// 	  const sortHelper = (nested: (Element | NestedArray<Element>)[]): (Element | NestedArray<Element>)[] => {
// 		return nested
// 		  .slice() // Copy to avoid mutating the original
// 		  .sort((a, b) => {
// 			if (isNestedArray(a) && isNestedArray(b)) {
// 			  return 0; // Keep nested arrays in their current order
// 			} else if (!isNestedArray(a) && !isNestedArray(b)) {
// 			  return comparator(a as Element, b as Element);
// 			} else {
// 			  return isNestedArray(a) ? 1 : -1; // Non-nested elements come first
// 			}
// 		  })
// 		  .map(value => (isNestedArray(value) ? new NestedArray(sortHelper(value as NestedArray<Element>[])) : value));
// 	  };
// 	  return new NestedArray(sortHelper(this.data));
// 	}
  
// 	nestedReduce<U>(reducer: (accumulator: U, currentValue: Element) => U, initialValue: U): U {
// 	  const reduceHelper = (nested: (Element | NestedArray<Element>)[], accumulator: U): U => {
// 		return nested.reduce((acc, value) => {
// 		  if (isNestedArray(value)) {
// 			return reduceHelper(value as NestedArray<Element>[], acc);
// 		  } else {
// 			return reducer(acc, value as Element);
// 		  }
// 		}, accumulator);
// 	  };
// 	  return reduceHelper(this.data, initialValue);
// 	}
//   }
  
//   // Usage example
//   const nestedArray: NestedArray<number> = new NestedArray<number>([1, [2, [3, 4], 5]]);
//   const mapped = nestedArray.nestedMap(x => x * 2);
//   const sorted = nestedArray.nestedSort((a, b) => a - b);
//   const reduced = nestedArray.nestedReduce((sum, current) => sum + current, 0);
  
//   console.log(mapped); // MyNestedArray containing [2, [4, [6, 8], 10]]
//   console.log(sorted); // MyNestedArray containing [1, [2, [3, 4], 5]] (sorted)
//   console.log(reduced); // 15