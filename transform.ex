defmodule Transform do
  @items [
    %{id: 2, seqId: 4, parent: 5, name: "index.tsx"},
    %{id: 3, seqId: 3, parent: 1, name: "Sidebar"},
    %{id: 4, seqId: 5, parent: 1, name: "Table"},
    %{id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx"},
    %{id: 5, seqId: 2, parent: 1, name: "AssignmentTable"},
    %{id: 1, seqId: 1, parent: nil, name: "components"},
    %{id: 6, seqId: 2, parent: nil, name: "controllers"}
  ]

  @items_cycle [
    %{id: 2, seqId: 4, parent: 5, name: "index.tsx"},
    %{id: 3, seqId: 3, parent: 1, name: "Sidebar"},
    %{id: 4, seqId: 5, parent: 1, name: "Table"},
    %{id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx"},
    %{id: 5, seqId: 2, parent: 1, name: "AssignmentTable"},
    %{id: 1, seqId: 1, parent: 2, name: "components"},
    %{id: 6, seqId: 2, parent: nil, name: "controllers"}
  ]

  def run do
    Enum.map([@items, @items_cycle], fn items ->
      IO.inspect(items, label: "=========> Input")

      items
      |> transform_items()
      |> IO.inspect(label: "---------> Transformed")
    end)
  end

  def transform_items(items) do
    # TODO
    items
  end
end
