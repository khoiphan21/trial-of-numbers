import { sleep, sleepUntil } from '../time';
import { runAndIgnoreError } from './safe-run';

/**
 * Check if the element is within view and scroll it into view if necessary
 *
 * @returns true if within view, false if otherwise
 */
export async function checkAndScrollIntoView(
  element?: HTMLElement
): Promise<void> {
  await sleepUntil('element exists', () => !!element, 100, 2000);

  if (!element) return;

  const scrollAndWait = async () => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleepUntil(
      'element is within view',
      () => {
        return isInViewport(element, document);
      },
      50,
      1000
    );
  };

  if (!isInViewport(element, document)) {
    try {
      await scrollAndWait();
    } catch (error) {
      // the scroll into view was probably interrupted, try again
      await runAndIgnoreError(() => scrollAndWait());
      // If this fails again... too bad.
    }

    // to be sure, await an extra 200 millisecs
    await sleep(200);
  }
}

function isInViewport(element: HTMLElement, document: Document) {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
