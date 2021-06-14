type ID = number;

export type Service = {
  validateCollection: (collection: Array<any>) => void;
  mkResult: (node: TNode<any>, depth: number) => any;
  mkRoot: () => TNode<any>;
  collectionToNodes: (collection: Array<any>) => Tree<any>;
  collectionSorter: (a: TNode<any>, b: TNode<any>) => number;
}

export type TNode<A> = {
  id: ID;
  parent: ID | null,
  metadata: A;
  children: Tree<A>;
}

export type Tree<A> = Array<TNode<A>>
export const ROOT = 0

/*                   FUNCTIONS                   */

const buildTree = (service: Service, nodes: Tree<any>, tree: Tree<any>, currNode: TNode<any>): Tree<any> => {
  const children = nodes.filter(node => node.parent === currNode.id)

  if (children.length) {
    if (currNode.id == ROOT) {
      tree = children
    } else {
      currNode.children = children.sort(service.collectionSorter)
    }

    children.forEach(child => {
      buildTree(service, nodes, [], child)
    })
  }

  return tree
}

/**
 *
 * Performs a DFS preorder traversal. Since I want to
 * get the innermost top-level sibling first.
 *
 * @param tree - The tree to be dumped to a list
 * @param parent - Current visited node
 * @param results - The list of results from a tree
 * @returns Results
 */
const treeToResults = (service: Service, tree: Tree<any>, node: TNode<any>, results: Array<any>, depth: number = -1): Array<any> => {
  if (node.id === ROOT) {
    if (tree.length === 0) {
      return []
    }

    node.children = tree[ROOT].children
  } else {
    results = [...results, service.mkResult(node, depth)]
  }

  tree.forEach(child => {
    results = results.concat(treeToResults(service, child.children, child, [], depth + 1))
  })

  return results
}

export const transformItems = (service: Service, collection: Array<any>): Array<any> => {
  // I'm not sure if theres an equivalent to Haskell's type variables.
  // a -> b for example. So if you were to try to fit something that
  // requires `b` with `a` then it wouldn't really work all too well
  // depending on the context.
  //
  // So it allows you to define two different type variables but it seems
  // like TS only allows you to define `any`, and all `any`s are the same.
  // Kinds sucks. Unless there's a way that I missed.
  let tree: Tree<any> = []

  // Validate if there are any known edge cases present in the collection.
  service.validateCollection(collection)

  // Convert collection to a list of `TNode`s, or in this case, a `Tree`.
  // But this has a flat structure, and the hierarchies have not been
  // established yet.
  const nodes: Tree<any> = service.collectionToNodes(collection)

  // This is where the hierarchies are constructed from the flat structure.
  tree = buildTree(service, nodes, tree, service.mkRoot())

  // Dumps it into the expected output with depth data.
  return treeToResults(service, tree, service.mkRoot(), [])
}
