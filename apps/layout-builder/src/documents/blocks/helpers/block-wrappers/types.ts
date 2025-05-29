import { CSSProperties } from "react";

export type TEditorBlockWrapperProps = {
  children: JSX.Element;
};

export type BlockStyleProps = {
  outline?: CSSProperties["outline"];
  backgroundColor?: string;
  isDragTarget?: boolean;
  isBeingDragged?: boolean;
  isSelected?: boolean;
  mouseInside?: boolean;
};

export type DropIndicatorProps = {
  blockId: string;
  blockType?: string;
  isValidDropTarget: boolean;
  isDragging: boolean;
  dropPosition: "before" | "after" | "inside" | null;
};