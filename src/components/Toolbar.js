/* eslint-disable fp/no-let */
import React from 'react'
import { connect } from 'react-redux'
import { shortcutById } from '../shortcuts'
import {
  overlayReveal,
  overlayHide,
  overlayUpdate
} from '../action-creators/toolbar'
import { SHORTCUT_HINT_OVERLAY_TIMEOUT } from '../constants'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const isTouchEnabled = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

const clearHoldTimer = () => {
  overlayHide()
  clearTimeout(holdTimer)
}

(() => {
  window.addEventListener('mouseup', clearHoldTimer)
  window.addEventListener('touchend', clearHoldTimer)
})()

const shortcutIds = [
  'outdent',
  'indent',
  'delete',
  'toggleContextView',
  'exportContext',
  'search',
]

const ToolbarMessageOverlay = ({
  classname = 'toolbar-overlay',
  id
}) => {
  const { name, description } = shortcutById(id)
  return (
    <div className={classname}>
      <div className={'overlay-name'}>{name}</div>
      <div className={'overlay-body'}>{description}</div>
    </div>
  )
}

let holdTimer

const onHoldDownShortcut = id => {
  // on chrome setTimeout doesn't seem to work on the first click, clearing it before hand fixes the problem
  clearTimeout(holdTimer)
  holdTimer = setTimeout(() => {
    overlayReveal(id)
  }, SHORTCUT_HINT_OVERLAY_TIMEOUT)
}

export const Toolbar = connect(({ toolbarOverlay, settings: { dark } }) => ({
  dark,
  toolbarOverlay
}))(
  ({
    dark,
    toolbarOverlay: {
      showOverlay,
      shortcutId
    }
  }) => (
    <div>
      <div className={'toolbar-container'}>
        <div className={'toolbar'}>
          {shortcutIds.map(id => {
            const { name, svg: Icon, exec } = shortcutById(id)
            return (
              <div
                key={name}
                id={id}
                className='toolbar-icon'
                onMouseDown={() => onHoldDownShortcut(id)}
                onMouseOver={() => overlayUpdate(id)}
                onTouchStart={() => onHoldDownShortcut(id)}
                onClick={() => exec(id)}
              >
                <Icon id={id} fill={dark ? 'white' : 'black'} />
              </div>
            )
          })}
        </div>
        <TransitionGroup>
          <CSSTransition key={0} timeout={200} classNames='fade'>
            {!isTouchEnabled() && showOverlay ? (
              <ToolbarMessageOverlay
                id={shortcutId}
              />
            ) : <span></span>}
          </CSSTransition>
        </TransitionGroup>
      </div>
      <TransitionGroup>
        <CSSTransition key={0} timeout={200} classNames='fade'>
          {isTouchEnabled() && showOverlay ? (
            <ToolbarMessageOverlay
              classname={'touch-toolbar-overlay'}
              id={shortcutId}
            />
          ) : <span></span>}
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
)
