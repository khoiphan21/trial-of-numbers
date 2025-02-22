export function isCtrlEnter(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && event.ctrlKey;
}

export function isShiftEnter(event: KeyboardEvent): boolean {
  return event.key === 'Enter' && event.shiftKey;
}
