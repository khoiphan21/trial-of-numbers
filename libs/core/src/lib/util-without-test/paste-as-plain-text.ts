export function pasteAsPlainText(event: ClipboardEvent) {
  let paste = (event.clipboardData || (window as any).clipboardData).getData(
    'text'
  );
  paste = paste.trim();

  const selection = window.getSelection();

  if (!selection) {
    return false;
  }

  if (!selection.rangeCount) {
    return false;
  }

  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(paste));
  document.getSelection()?.collapseToEnd();

  event.preventDefault();

  return false;
}
