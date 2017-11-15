import { store, selectors } from './globals'

import getCorePlacement from '../utils/getCorePlacement'
import find             from '../utils/find'
import prefix           from '../utils/prefix'
import closest          from '../utils/closest'

/**
* Mousemove event listener handler for `followCursor` option
* @param {Element} reference
* @return {Function} the event handler
*/
export default function followCursorHandler(reference) {
  const data = find(store, data => data.reference === reference)
  
  const handler = e => {
    const {
      popper,
      options: {
        offset
      }
    } = data

    const placement = getCorePlacement(popper.getAttribute('x-placement'))
    const halfPopperWidth = Math.round(popper.offsetWidth / 2)
    const halfPopperHeight = Math.round(popper.offsetHeight / 2)
    const viewportPadding = 5
    const pageWidth = document.documentElement.offsetWidth || document.body.offsetWidth

    const { pageX, pageY } = e

    let x, y

    switch (placement) {
      case 'top':
        x = pageX - halfPopperWidth + offset
        y = pageY - 2 * halfPopperHeight
        break
      case 'bottom':
        x = pageX - halfPopperWidth + offset
        y = pageY + 10
        break
      case 'left':
        x = pageX - 2 * halfPopperWidth
        y = pageY - halfPopperHeight + offset
        break
      case 'right':
        x = pageX + 5
        y = pageY - halfPopperHeight + offset
        break
    }

    const isRightOverflowing = pageX + viewportPadding + halfPopperWidth + offset > pageWidth
    const isLeftOverflowing = pageX - viewportPadding - halfPopperWidth + offset < 0

    // Prevent left/right overflow
    if (placement === 'top' || placement === 'bottom') {
      if (isRightOverflowing) {
        x = pageWidth - viewportPadding - 2 * halfPopperWidth
      }

      if (isLeftOverflowing) {
        x = viewportPadding
      }
    }

    popper.style[prefix('transform')] = `translate3d(${x}px, ${y}px, 0)`
  }
  
  data._followCursorHandler = handler
  
  return handler
}
