import {
  Items,
  validateItems,
  mkItemRoot,
  itemsToNodes,
  itemSorter,
  mkResult
} from "./item.js"

import { Service, transformItems } from "./tree.js"

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
  { id: 5, seqId: 2, parent: 2, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: null, name: "components" },
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

const itemsWithZeroAsId: Items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: null, name: "components" },
  { id: 0, seqId: 2, parent: null, name: "controllers" },
]

/*                   TESTING                   */

const data = [
  { label: "Test success case", items: items },
  { label: "Test mismatched IDs (error)", items: itemsMismatchId },
  { label: "Test duplicate IDs (error)", items: itemsDuplicate },
  { label: "Test exclude cycle (error)", items: itemsCycle },
  { label: "Test item that has zero as an ID (error)", items: itemsWithZeroAsId }
]

/**
 * To be injected to `transformItems`.
 */

const service: Service = {
  mkResult,
  validateCollection: validateItems,
  mkRoot: mkItemRoot,
  collectionToNodes: itemsToNodes,
  collectionSorter: itemSorter,
}

data.forEach(({ label, items }) => {
  try {
    console.log(`=========> ${label}\n`, items, "\n")
    console.log("---------> Transformed\n", transformItems(service, items), "\n")
  } catch (error) {
    console.log(`---------> ${error}`)
  }
});