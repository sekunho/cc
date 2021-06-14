import { Tree, TNode, ROOT } from "./tree.js"

export type ID = number;

export type Item = {
  id: ID;
  seqId: ID;
  parent: ID | null;
  name: string;
};

export type Items = Array<Item>;

const filterUnique = (list: Array<number>) => {
  return list.filter((id, ndx, a) => a.indexOf(id) == ndx)
}

/**
 * Validates the items in a list. Checks if:
 *
 * 1. Items with the same `id`. (duplicate entries)
 * 2. Item's `parent` references a non-existent item.
 * 3. Items should not have an ID of `0` since this is
 * reserved for the root node.
 *
 * @param items - Directory items to validate
 */
export const validateItems = (items: Items) => {
  const availIds = items.map(item => item.id)
  const uniqAvailIds = filterUnique(availIds)

  if (availIds.length != uniqAvailIds.length) {
    throw "ERROR: There are duplicate entries.\n\n"
  }

  const reqIds =
    items
      .map(item => item.parent)
      .filter(item => item != null)
      .filter((id, ndx, a) => a.indexOf(id) == ndx)

  reqIds.map(id => {
    if (!(uniqAvailIds.includes(id))) {
      throw `ERROR: Parent ID ${id} does not exist in items list.\n\n`
    }
  })

  const zeroIds: Array<number> = uniqAvailIds.filter(id => id === 0)

  if (zeroIds.length > 0) {
    throw "ERROR: Item ID cannot contain a zero as this is a reserved ID."
  }
}

/**
 * Creates a blank node to be used as the root of the tree.
 *
 * @returns TNode<Item>
 */
export const mkItemRoot = (): TNode<Item> => {
  return {
    id: ROOT,
    parent: null,
    metadata: {
      id: ROOT,
      seqId: null,
      parent: null,
      name: ""
    },
    children: []
  }
}

/**
 * Parses `items` into a flat list of nodes.
 *
 * @param items - Directory structure items
 * @returns Tree<Item>
 */
export const itemsToNodes = (items: Items): Tree<Item> => {
  const acc: Tree<Item> = []

  return items.reduce((acc: Tree<Item>, elem: Item): Tree<Item> => {
    const node: TNode<Item> = {
      id: elem.id,
      parent: elem.parent == null ? 0 : elem.parent,
      metadata: elem,
      children: []
    }

    return [...acc, node]
  }, acc)
}

/**
 * Sort logic for `Item`.
 *
 * @param a TNode<Item>
 * @param b TNode<Item>
 * @returns number
 */
export const itemSorter = (a: TNode<Item>, b: TNode<Item>): number => {
  return a.metadata.seqId > b.metadata.seqId ? 1 : -1
}

/**
 * Parses a `TNode<Item>` into an object.
 *
 * @param node Node - The node to be converted to a result object.
 * @param depth number - How deep down the tree the node is situated.
 * @returns Object
 */
export const mkResult = (node: TNode<Item>, depth: number): Object => {
  return {
    id: node.metadata.id,
    seqId: node.metadata.seqId,
    name: node.metadata.name,
    parent: node.parent === 0 ? null : node.parent,
    depth: depth
  }
}
