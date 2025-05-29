import React, { CSSProperties, forwardRef } from "react";
import { Box } from "@mui/material";
import { BlockStyleProps } from "../types";

type BlockContainerProps = {
  children: React.ReactNode;
  styleProps: BlockStyleProps;
  onMouseEnter: (ev: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: (ev: React.MouseEvent) => void;
  onMouseUp: () => void;
};

const BlockContainer = forwardRef<HTMLDivElement, BlockContainerProps>(
  ({ children, styleProps, onMouseEnter, onMouseLeave, onClick, onMouseUp }, ref) => {
    const { outline, backgroundColor, isBeingDragged, isDragTarget } = styleProps;

    return (
      <Box
        ref={ref}
        sx={{
          position: "relative",
          maxWidth: "100%",
          outlineOffset: "-1px",
          outline,
          backgroundColor,
          cursor: isBeingDragged ? "grabbing" : isDragTarget ? "pointer" : "default",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onMouseUp={onMouseUp}
      >
        {children}
      </Box>
    );
  }
);

BlockContainer.displayName = "BlockContainer";

export default BlockContainer;