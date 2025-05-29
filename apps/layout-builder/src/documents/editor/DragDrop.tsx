import { TEditorBlock } from "./core";
import {
  editorStateStore,
  resetDocument,
  setSelectedBlockId,
} from "./EditorContext";

// Add these methods to manage drag state
export function beginDrag(blockId: string) {
  return editorStateStore.setState({
    dragState: {
      isDragging: true,
      draggedBlockId: blockId,
      dropTargetId: null,
      dropPosition: null,
    },
  });
}

export function updateDragTarget(
  dropTargetId: string | null,
  dropPosition: "before" | "after" | "inside" | null
) {
  const state = editorStateStore.getState();
  return editorStateStore.setState({
    dragState: {
      ...state.dragState,
      dropTargetId,
      dropPosition,
    },
  });
}

export function endDrag() {
  const { dragState, document } = editorStateStore.getState();

  if (
    dragState.isDragging &&
    dragState.draggedBlockId &&
    dragState.dropTargetId &&
    dragState.dropPosition
  ) {
    // Perform the actual move operation
    executeMove(
      dragState.draggedBlockId,
      dragState.dropTargetId,
      dragState.dropPosition
    );
  }

  return editorStateStore.setState({
    dragState: {
      isDragging: false,
      draggedBlockId: null,
      dropTargetId: null,
      dropPosition: null,
    },
  });
}

export function useDragState() {
  return editorStateStore((state) => state.dragState);
}

// Helper function to execute the actual move
function executeMove(
  sourceBlockId: string,
  targetBlockId: string,
  position: "before" | "after" | "inside"
) {
  const { document } = editorStateStore.getState();
  const newDocument = { ...document };

  // Find the parent of the source block and remove it from there
  let sourceBlock: TEditorBlock | undefined;

  // First, find and store the sourceBlock
  for (const [id, block] of Object.entries(newDocument)) {
    if (id === sourceBlockId) {
      sourceBlock = block as TEditorBlock;
      break;
    }
  }

  if (!sourceBlock) return;

  // Remove the block from its current parent
  for (const [id, b] of Object.entries(newDocument)) {
    const block = b as TEditorBlock;

    switch (block.type) {
      case "EmailLayout":
        if (block.data.childrenIds?.includes(sourceBlockId)) {
          newDocument[id] = {
            ...block,
            data: {
              ...block.data,
              childrenIds: block.data.childrenIds.filter(
                (id) => id !== sourceBlockId
              ),
            },
          };
        }
        break;
      case "Container":
        if (block.data.props?.childrenIds?.includes(sourceBlockId)) {
          newDocument[id] = {
            ...block,
            data: {
              ...block.data,
              props: {
                ...block.data.props,
                childrenIds: block.data.props.childrenIds.filter(
                  (id) => id !== sourceBlockId
                ),
              },
            },
          };
        }
        break;
      case "ColumnsContainer":
        if (block.data.props?.columns) {
          let columnUpdated = false;
          const updatedColumns = block.data.props.columns.map((column) => {
            if (column.childrenIds?.includes(sourceBlockId)) {
              columnUpdated = true;
              return {
                ...column,
                childrenIds: column.childrenIds.filter(
                  (id) => id !== sourceBlockId
                ),
              };
            }
            return column;
          });

          if (columnUpdated) {
            newDocument[id] = {
              ...block,
              data: {
                ...block.data,
                props: {
                  ...block.data.props,
                  columns: updatedColumns as any,
                },
              },
            };
          }
        }
        break;
    }
  }

  // Add block to the target position
  const targetBlock = newDocument[targetBlockId] as TEditorBlock;

  if (position === "inside" && targetBlock) {
    // Insert inside the target
    switch (targetBlock.type) {
      case "EmailLayout":
        newDocument[targetBlockId] = {
          ...targetBlock,
          data: {
            ...targetBlock.data,
            childrenIds: [
              ...(targetBlock.data.childrenIds || []),
              sourceBlockId,
            ],
          },
        };
        break;
      case "Container":
        newDocument[targetBlockId] = {
          ...targetBlock,
          data: {
            ...targetBlock.data,
            props: {
              ...targetBlock.data.props,
              childrenIds: [
                ...(targetBlock.data.props?.childrenIds || []),
                sourceBlockId,
              ],
            },
          },
        };
        break;
      case "ColumnsContainer":
        // For columns container, we would need an additional parameter to know which column
        // For simplicity, let's assume we're adding to the first column
        if (targetBlock.data.props?.columns?.[0]) {
          const updatedColumns = [...targetBlock.data.props.columns];
          updatedColumns[0] = {
            ...updatedColumns[0],
            childrenIds: [
              ...(updatedColumns?.[0]?.childrenIds || []),
              sourceBlockId,
            ],
          };

          newDocument[targetBlockId] = {
            ...targetBlock,
            data: {
              ...targetBlock.data,
              props: {
                ...targetBlock.data.props,
                columns: updatedColumns as any,
              },
            },
          };
        }
        break;
    }
  } else {
    // Find the parent of the target block and insert before/after it
    for (const [id, b] of Object.entries(newDocument)) {
      const block = b as TEditorBlock;

      switch (block.type) {
        case "EmailLayout":
          if (block.data.childrenIds?.includes(targetBlockId)) {
            const index = block.data.childrenIds.indexOf(targetBlockId);
            const newChildrenIds = [...block.data.childrenIds];
            newChildrenIds.splice(
              position === "before" ? index : index + 1,
              0,
              sourceBlockId
            );

            newDocument[id] = {
              ...block,
              data: {
                ...block.data,
                childrenIds: newChildrenIds,
              },
            };
          }
          break;
        case "Container":
          if (block.data.props?.childrenIds?.includes(targetBlockId)) {
            const index = block.data.props.childrenIds.indexOf(targetBlockId);
            const newChildrenIds = [...block.data.props.childrenIds];
            newChildrenIds.splice(
              position === "before" ? index : index + 1,
              0,
              sourceBlockId
            );

            newDocument[id] = {
              ...block,
              data: {
                ...block.data,
                props: {
                  ...block.data.props,
                  childrenIds: newChildrenIds,
                },
              },
            };
          }
          break;
        case "ColumnsContainer":
          if (block.data.props?.columns) {
            let columnUpdated = false;
            const updatedColumns = block.data.props.columns.map((column) => {
              if (column.childrenIds?.includes(targetBlockId)) {
                columnUpdated = true;
                const index = column.childrenIds.indexOf(targetBlockId);
                const newChildrenIds = [...column.childrenIds];
                newChildrenIds.splice(
                  position === "before" ? index : index + 1,
                  0,
                  sourceBlockId
                );

                return {
                  ...column,
                  childrenIds: newChildrenIds,
                };
              }
              return column;
            });

            if (columnUpdated) {
              newDocument[id] = {
                ...block,
                data: {
                  ...block.data,
                  props: {
                    ...block.data.props,
                    columns: updatedColumns as any,
                  },
                },
              };
            }
          }
          break;
      }
    }
  }

  resetDocument(newDocument);
  setSelectedBlockId(sourceBlockId);
}
