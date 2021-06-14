/*                   TYPES                   */
type ID = number;

type Item = {
  id: ID;
  seqId: ID;
  parent: ID | null;
  name: string;
};

type Items = Array<Item>;

type Result = Item & { depth: number };

type Results = Array<Result>;

type Parents = {
  [key: string]: ID | null;
};

type Visited = {
  [key: string]: boolean;
};



/*                   SAMPLE DATA                   */
const items: Items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: null, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" },
]

const itemsMismatchId: Items = [
  { id: 2, seqId: 4, parent: 100, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: 2, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" },
]

const itemsCycle: Items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: 2, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" },
]

const itemsDuplicate: Items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 2, seqId: 1, parent: null, name: "main.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: 2, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" },
]



/*                   FUNCTIONS                   */
const getParents = (items: Items): Parents => {
  const parents: Parents = {}

  return items.reduce((parents: Parents, elem: Item) => {
    parents[elem.id] = elem.parent

    return parents
  }, parents)
}

const computeDepthAndRoot = (id: number, parents: Parents, visited: Visited, depth: number): any => {
  // Cycles == bad
  if (visited[id]) {
    throw `ERROR: Cycle detected in ${id} -> ${parents[id]}. ${id} has already been visited before.}`
  }

  visited[id] = true

  if (parents[id] !== null) {
    // This is probably bad but it's pretty much guaranteed that `parents[id]` isn't null.
    return computeDepthAndRoot(parents[id]!, parents, visited, depth + 1)
  } else {
    return { depth: depth, root: id }
  }
}

/**
 * Sorts the name of a result.
 *
 * @param {Buffer} buffer - Items grouped by their root ID.
 */
const nameSorter = (a: Result, b: Result): number => {
  return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
}

/**
 * Preps the buffer by flattening the buffer, and sorting the results.
 *
 * @param {Buffer} buffer - Results grouped by their root ID.
 */
const prep = (buffer: any): Results => {
  const acc: Results = []

  const sortedResults: Results =
    Object
      .keys(buffer)
      .reduce((results, key) => {
        const root = buffer[key].results[0]

        const sortedContents: Results =
          buffer[key].results
            .slice(1)
            .sort(nameSorter)

        const sortedResults: Results = [root].concat(sortedContents)

        return results.concat(sortedResults)
      }, acc)

  return sortedResults
}

const filterUnique = (list: Array<number>) => {
  return list.filter((id, ndx, a) => a.indexOf(id) == ndx)
}

const validateItems = (items: Items) => {
  const availIds = items.map(item => item.id)
  const uniqAvailIds = filterUnique(availIds)

  if(availIds.length != uniqAvailIds.length) {
    throw "ERROR: There are duplicate entries\n\n"
  }

  const reqIds =
    items
      .map(item => item.parent)
      .filter(item => item != null)
      .filter((id, ndx, a) => a.indexOf(id) == ndx)

  reqIds.map(id => {
    if(!(id in uniqAvailIds)) {
      throw `ERROR: Parent ID ${id} does not exist in items list.\n\n`
    }
  })
}

/**
 * Transforms items into sorted items with depth information.
 *
 * @param {Items} items - The items representing a directory structure.
 *
 * Example:
 *
 * const items: Items = [
 *   { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
 *   { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
 *   { id: 4, seqId: 5, parent: 1, name: "Table" },
 *   { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
 *   { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
 *   { id: 1, seqId: 1, parent: null, name: "components" },
 *   { id: 6, seqId: 2, parent: null, name: "controllers" }
 * ]
 *
 * > transformItems(items)
 * [ { id: 1, seqId: 1, parent: null, name: 'components', depth: 0 },
 *  { id: 5, seqId: 2, parent: 1, name: 'AssignmentTable', depth: 1 },
 *  { id: 2, seqId: 4, parent: 5, name: 'index.tsx', depth: 2 },
 *  { id: 7,
 *    seqId: 5,
 *    parent: 5,
 *    name: 'SelectableDropdown.tsx',
 *    depth: 2 },
 *  { id: 3, seqId: 3, parent: 1, name: 'Sidebar', depth: 1 },
 *  { id: 4, seqId: 5, parent: 1, name: 'Table', depth: 1 },
 *  { id: 6, seqId: 2, parent: null, name: 'controllers', depth: 0 } ]
 *
 */
const transformItems = (items: Items): any => {
  validateItems(items)

  // Contains information on the parent ID of an item ID.
  const parents: Parents = getParents(items)

  // Intermediary data grouped according to the common root ID.
  const buffer = items.reduce((buffer: any, item: Item): any => {
    const { depth, root } = computeDepthAndRoot(item.id, parents, {}, 0)

    const result: Result = {
      ...item,
      depth: depth
    }

    if (!buffer[root]) {
      buffer[root] = {
        root: root,
        results: []
      }
    }

    // Put the root node at the top of the list.
    if (root == result.id) {
      buffer[root].results.unshift(result)
    } else {
      buffer[root].results.push(result)
    }

    return buffer
  }, {})

  return prep(buffer)
}

const data = [
  {label: "Test success", items: items},
  // {label: "Test mismatched IDs", items: itemsMismatchId},
  // {label: "Test duplicate IDs", items: itemsDuplicate},
  // {label: "Test items cycle", items: itemsCycle}
]

data.forEach(({label, items}) => {
  try {
    console.log(`=========> ${label}\n`, items, "\n")
    console.log("---------> Transformed\n", transformItems(items), "\n")
  } catch(error) {
    console.log(`---------> ${error}`)
  }
});
