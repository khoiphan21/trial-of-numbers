import { ElementRef } from '@angular/core';

export type DropPosition = 'left' | 'right' | 'top' | 'bottom';

export const AUTO_SCROLL_RANGE = 40;
export const DROP_ZONE_RADIUS_OUT = 40;
export const DROP_ZONE_RADIUS_IN = 10;
export const BORDER_ELEMENT_PADDING = 8;
export const DRAG_SHADOW_SHIFT_X = 25;
export const DRAG_DROP_OVERLAY_NAME = 'modulr-drag-drop-overlay-container';

export type DnDState = 'drag-start' | 'dragging' | 'drag-end';
export type DnDType = 'reorder' | 'transfer';
export interface DnDEvent {
  dragId?: string; // id of dragging block
  dropId?: string; // id of block that dragging block is dropped on
  dropZoneId?: string; // id of destination zone
  position?: DropPosition;
  type?: DnDType;
}

export interface DnDBorder {
  elementId?: string; // id of the element has drop border
  position?: DropPosition; // Current border position
  border?: HTMLElement; // Actual border in DOM
}

export interface CreateDnDBorderInput {
  elementId: string;
  element: HTMLElement;
  position: DropPosition;
}

export interface DnDContextData {
  state: DnDState;
  contextId: string;
  event: MouseEvent;
}

export interface DnDClosestElement {
  id: string;
  ref: ElementRef<any>;
  element: HTMLElement;
}
