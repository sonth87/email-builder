import { useEffect, RefObject } from "react";
import { useDragState } from "../../../../editor/DragDrop";

export function useDragGhostEffect(
  blockRef: RefObject<HTMLDivElement>,
  blockType?: string,
  blockId?: string
) {
  const dragState = useDragState();
  const isBeingDragged = dragState.isDragging && dragState.draggedBlockId === blockId;

  useEffect(() => {
    if (!isBeingDragged || !blockRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;
      
      let ghost = document.getElementById('drag-ghost');
      
      if (!ghost && blockRef.current) {
        ghost = document.createElement('div');
        ghost.id = 'drag-ghost';
        ghost.style.position = 'fixed';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '9999';
        ghost.style.opacity = '0.85';
        ghost.style.transform = 'rotate(2deg) scale(0.9)';
        ghost.style.backgroundColor = '#fff';
        ghost.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
        ghost.style.borderRadius = '4px';
        ghost.style.padding = '8px';
        ghost.style.width = `${Math.min(blockRef.current.offsetWidth, 300)}px`;
        ghost.style.maxHeight = '120px';
        ghost.style.overflow = 'hidden';
        ghost.style.border = `2px dashed #0079cc`;
        ghost.style.transition = 'transform 0.12s ease';
        
        const displayBlockName = blockType || 'Block';
        ghost.innerHTML = `
          <div style="
            padding: 8px; 
            font-size: 13px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; 
            font-weight: 500;
            background-color: rgba(0,121,204, 0.08); 
            color: #0079cc;
            border-bottom: 1px solid rgba(0,121,204, 0.15);
            display: flex;
            align-items: center;
          ">
            <span style="margin-right: 5px;">⋮⋮</span>
            ${displayBlockName}
          </div>
          <div style="
            padding: 8px; 
            font-size: 12px; 
            color: #666; 
            overflow: hidden; 
            text-overflow: ellipsis;
            white-space: nowrap;
          ">
            Moving element...
          </div>
        `;
        
        document.body.appendChild(ghost);
      }
      
      if (ghost) {
        ghost.style.left = `${e.clientX + 15}px`;
        ghost.style.top = `${e.clientY + 15}px`;
        
        const speedFactor = Math.min(Math.abs(e.movementX) / 10, 3);
        const rotateAmount = e.movementX > 0 ? speedFactor : -speedFactor;
        ghost.style.transform = `rotate(${2 + rotateAmount}deg) scale(0.9)`;
      }
    };

    const handleMouseUp = () => {
      const ghost = document.getElementById('drag-ghost');
      if (ghost) {
        ghost.style.transition = 'opacity 0.3s, transform 0.3s';
        ghost.style.opacity = '0';
        ghost.style.transform = 'scale(0.8) translateY(10px)';
        
        setTimeout(() => {
          ghost?.remove();
        }, 300);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      const ghost = document.getElementById('drag-ghost');
      if (ghost) ghost.remove();
    };
  }, [isBeingDragged, blockType, dragState.isDragging, blockId]);
}