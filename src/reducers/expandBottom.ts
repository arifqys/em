import { expandThoughts } from '../selectors'
import { Path, State } from '../@types'
import { headId } from '../util'

interface Options {
  path: Path
}

/**
 * Calculates the expanded context due to hover expansion on empty child drop.
 */
const expandBottom = (state: State, { path }: Options): State => {
  const contextHash = headId(path)
  const expandHoverBottomPaths = { ...state.expandHoverBottomPaths, [contextHash]: path }

  const expandedBottomPaths = Object.values(expandHoverBottomPaths)
  // expanded thoughts due to hover expansion
  const updatedExpandedBottom = expandedBottomPaths.reduce(
    (acc, path) => ({ ...acc, ...expandThoughts(state, path) }),
    {},
  )

  return { ...state, expandHoverBottomPaths, expandedBottom: updatedExpandedBottom }
}

export default expandBottom
