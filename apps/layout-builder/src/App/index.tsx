import React, { useEffect } from "react";
import { Stack, useTheme } from "@mui/material";
import {
  useInspectorDrawerOpen,
  useSamplesDrawerOpen,
} from "../documents/editor/EditorContext";

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from "./InspectorDrawer";
import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from "./SamplesDrawer";
import TemplatePanel from "./TemplatePanel";
import { endDrag, useDragState } from "../documents/editor/DragDrop";

function useDrawerTransition(
  cssProperty: "margin-left" | "margin-right",
  open: boolean,
) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open
      ? transitions.duration.leavingScreen
      : transitions.duration.enteringScreen,
  });
}

export default function App() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const dragState = useDragState();

  const marginLeftTransition = useDrawerTransition(
    "margin-left",
    samplesDrawerOpen,
  );
  const marginRightTransition = useDrawerTransition(
    "margin-right",
    inspectorDrawerOpen,
  );

  // Add global mouse event handlers for drag operations
  useEffect(() => {
    if (dragState.isDragging) {
      // Add a global mouseup handler to end drag operations
      const handleMouseUp = () => {
        endDrag();
      };
      
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging]);

  return (
    <>
      <InspectorDrawer />
      <SamplesDrawer />

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(", "),
          cursor: dragState.isDragging ? 'grabbing' : 'default',
        }}
      >
        <TemplatePanel />
      </Stack>
    </>
  );
}
