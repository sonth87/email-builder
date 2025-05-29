import React, { useRef, useState } from "react";

import { useCurrentBlockId } from "../../../editor/EditorBlock";
import {
  setSelectedBlockId,
  useDocument,
  useSelectedBlockId,
} from "../../../editor/EditorContext";
import { endDrag, useDragState } from "../../../editor/DragDrop";

import { BlockContainer, DropIndicators } from "./components";
import { useDragGhostEffect } from "./hooks";
import TuneMenu from "./TuneMenu";
import { TEditorBlockWrapperProps } from "./types";

export default function EditorBlockWrapper({
  children,
}: TEditorBlockWrapperProps) {
  // Hooks
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = useState(false);
  const blockId = useCurrentBlockId();
  const dragState = useDragState();
  const document = useDocument();
  const blockRef = useRef<HTMLDivElement>(null);

  // Get block type from document
  const blockType = document[blockId]?.type;

  // Determine drag states
  const isBeingDragged =
    dragState.isDragging && dragState.draggedBlockId === blockId;
  const isDragTarget = dragState.isDragging && dragState.dropTargetId === blockId;
  const isValidDropTarget = dragState.isDragging && dragState.draggedBlockId !== blockId;

  // Apply ghost effect when dragging
  useDragGhostEffect(blockRef, blockType, blockId);

  // Calculate visual styles based on state
  const outline =
    selectedBlockId === blockId
      ? "2px solid rgba(0,121,204, 1)"
      : mouseInside || isDragTarget
      ? "2px solid rgba(0,121,204, 0.3)"
      : undefined;

  const backgroundColor = isDragTarget
    ? "rgba(0,121,204, 0.1)"
    : undefined;

  // Event handlers
  const handleMouseEnter = (ev: React.MouseEvent) => {
    setMouseInside(true);
    ev.stopPropagation();
  };

  const handleMouseLeave = () => {
    setMouseInside(false);
  };

  const handleClick = (ev: React.MouseEvent) => {
    setSelectedBlockId(blockId);
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleMouseUp = () => {
    if (dragState.isDragging) {
      endDrag();
    }
  };

  return (
    <BlockContainer
      ref={blockRef}
      styleProps={{
        outline,
        backgroundColor,
        isBeingDragged,
        isDragTarget,
        isSelected: selectedBlockId === blockId,
        mouseInside,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
    >
      {selectedBlockId === blockId && <TuneMenu blockId={blockId} />}
      
      <DropIndicators
        blockId={blockId}
        blockType={blockType}
        isValidDropTarget={isValidDropTarget}
        isDragging={dragState.isDragging}
        dropPosition={dragState.dropPosition}
      />
      
      {children}
    </BlockContainer>
  );
}
