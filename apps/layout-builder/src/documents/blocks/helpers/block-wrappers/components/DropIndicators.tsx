import React from "react";
import { Box, keyframes } from "@mui/material";
import { DropIndicatorProps } from "../types";
import { updateDragTarget } from "../../../../editor/DragDrop";

const dropLineAnimation = keyframes`
  0% { height: 2px; opacity: 0.7; }
  50% { height: 4px; opacity: 1; }
  100% { height: 2px; opacity: 0.7; }
`;

const TopDropZone = ({ blockId, dropPosition }: { blockId: string; dropPosition: string | null }) => (
  <Box
    sx={{
      position: "absolute",
      top: -4,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor:
        dropPosition === "before"
          ? "rgba(0,121,204, 0.8)"
          : "transparent",
      zIndex: 100,
      "&:hover": {
        backgroundColor: "rgba(0,121,204, 0.8)",
      },
      "&::after": dropPosition === "before" ? {
        content: '""',
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 3,
        transform: "translateY(-50%)",
        backgroundColor: "#0079cc",
        borderRadius: 1,
        animation: `${dropLineAnimation} 1.5s infinite ease-in-out`
      } : {}
    }}
    onMouseEnter={() => updateDragTarget(blockId, "before")}
  />
);

const BottomDropZone = ({ blockId, dropPosition }: { blockId: string; dropPosition: string | null }) => (
  <Box
    sx={{
      position: "absolute",
      bottom: -4,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor:
        dropPosition === "after"
          ? "rgba(0,121,204, 0.8)"
          : "transparent",
      zIndex: 100,
      "&:hover": {
        backgroundColor: "rgba(0,121,204, 0.8)",
      },
      "&::after": dropPosition === "after" ? {
        content: '""',
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 3,
        transform: "translateY(-50%)",
        backgroundColor: "#0079cc",
        borderRadius: 1,
        animation: `${dropLineAnimation} 1.5s infinite ease-in-out`
      } : {}
    }}
    onMouseEnter={() => updateDragTarget(blockId, "after")}
  />
);

const CenterDropZone = ({ 
  blockId, 
  blockType, 
  dropPosition 
}: { 
  blockId: string; 
  blockType?: string;
  dropPosition: string | null;
}) => {
  const pulseAnimation = keyframes`
    0% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
    100% { opacity: 0.7; transform: scale(1); }
  `;
  
  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        backgroundColor:
          dropPosition === "inside"
            ? "rgba(0,255,0, 0.1)"
            : "transparent",
        border:
          dropPosition === "inside"
            ? "2px dashed rgba(0,255,0, 0.5)"
            : "none",
        zIndex: 99,
        display: ["Container", "ColumnsContainer", "EmailLayout"].includes(
          blockType || ""
        )
          ? "block"
          : "none",
        "&:hover": {
          backgroundColor: "rgba(0,255,0, 0.1)",
          border: "2px dashed rgba(0,255,0, 0.5)",
        },
        animation: dropPosition === "inside" 
          ? `${pulseAnimation} 2s infinite ease-in-out`
          : "none",
      }}
      onMouseEnter={() => updateDragTarget(blockId, "inside")}
    />
  );
};

const DropIndicators: React.FC<DropIndicatorProps> = ({
  blockId,
  blockType,
  isValidDropTarget,
  isDragging,
  dropPosition,
}) => {
  if (!isValidDropTarget || !isDragging) return null;

  return (
    <>
      <TopDropZone blockId={blockId} dropPosition={dropPosition} />
      <BottomDropZone blockId={blockId} dropPosition={dropPosition} />
      <CenterDropZone blockId={blockId} blockType={blockType} dropPosition={dropPosition} />
    </>
  );
};

export default DropIndicators;