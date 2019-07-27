import React from 'react'

/**
 *  原理：el监听鼠标按下事件、并触发document监听鼠标按下后的移动事件
 * */
function makeDraggable(el) {
  const configedCursor = el.style.cursor || 'grab'
  const configedTransition = el.style.transition

  el.style.cursor = configedCursor

  function mouseDown(e) {
    e.stopPropagation()
    el.style.transition = undefined// 禁用 Transition 设置（不然会拖拽不能）
    const matched =
      (el.style.transform || '').match(
        /(.*)translate\((\d+)px(?:, (\d+)px)?\)(.*)/
      ) || []
    const otherTransformLeft = String(matched[1] || '')
    const preTransX = Number(matched[2] || 0)
    const preTransY = Number(matched[3] || 0)
    const otherTransformRight = String(matched[4] || '')
    const mousedownX = e.x
    const mousedownY = e.y

    el.style.cursor = 'grabbing'

    function mouseMove(e) {
      const newTransX = e.x - mousedownX + preTransX
      const newTransY = e.y - mousedownY + preTransY
      el.style.transform = `${otherTransformLeft}translate(${newTransX}px, ${newTransY}px)${otherTransformRight}`
    }
    function mouseUp(e) {
      el.style.cursor = configedCursor
      el.style.transition = configedTransition
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
    }
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
  }
  el.addEventListener('mousedown', mouseDown)
}

/**
 *   核心概念：el监听鼠标按下事件、document监听鼠标按下后的移动事件
 * TODO:目前仅限右部与底部方向的拉伸，还需支持左部与顶部方向的拉伸，与特殊的四角拉伸
 * */
function makeScaleable(el, options) {
  if (options === true) options = { right: true }

  const configedCursor = el.style.cursor
  const configedTransition = el.style.transition

  function appendTriggerDivTo(target, style, triggerLoaction = 'right') {
    triggerLoaction = [triggerLoaction].flat()
    let scaleDirection = {}
    if (triggerLoaction.includes('right') || triggerLoaction.includes('left'))
      scaleDirection.x = true
    if (triggerLoaction.includes('bottom') || triggerLoaction.includes('top'))
      scaleDirection.y = true
    function mouseDown(e) {
      e.stopPropagation()
      el.style.transition = undefined
      const mousedownX = e.x
      const mousedownY = e.y
      const boxW = el.clientWidth
      const boxH = el.clientHeight
      function mouseMove(e) {
        const deltaX = e.x - mousedownX
        const deltaY = e.y - mousedownY
        const width = Math.max(10, deltaX + boxW)
        const height = Math.max(10, deltaY + boxH)
        if (scaleDirection.x) el.style.width = width + 'px'
        if (scaleDirection.y) el.style.height = height + 'px'
        // TODO:研究从顶部拉伸的逻辑
        // if (resizeOrigin === 'bottomright') {
        // // 找出上一次/初始的transform中translate的值
        //   const matched =
        //     (el.style.transform || '').match(
        //       /(.*)translate\((\d+)px(?:, (\d+)px)?\)(.*)/
        //     ) || []
        //   const otherTransformLeft = String(matched[1] || '')
        //   const preTransX = Number(matched[2] || 0)
        //   const preTransY = Number(matched[3] || 0)
        //   const otherTransformRight = String(matched[4] || '')
        //   el.style.transform = `${otherTransformLeft}translate(${x_ + preTransX}px, ${y_ + preTransY}px)${otherTransformRight}`
        // }
      }
      // 还原最初消去的设置，并消去不必要的监听（document上）
      function mouseUp(e) {
        el.style.cursor = configedCursor
        el.style.transition = configedTransition
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    }
    el.style.cursor = configedCursor || 'se-resize'
    const triggerDiv = document.createElement('div')
    Object.assign(triggerDiv.style, style)
    triggerDiv.addEventListener('mousedown', mouseDown)
    target.append(triggerDiv)
  }

  // if (options.top)
  //   appendTriggerDiv(
  //     el,
  //     {
  //       width: '100%',
  //       height: '5px',
  //       position: 'absolute',
  //       background: "#00000024",
  //       cursor: 'row-resize',
  //       top: 0
  //     },
  //     'top'
  //   )
  if (options.right)
    appendTriggerDivTo(
      el,
      {
        width: '5px',
        height: '100%',
        position: 'absolute',
        background: '#00000024',
        cursor: 'col-resize',
        right: 0
      },
      'right'
    )
  if (options.bottom)
    appendTriggerDivTo(
      el,
      {
        width: '100%',
        height: '5px',
        position: 'absolute',
        background: '#00000024',
        cursor: 'row-resize',
        bottom: 0
      },
      'bottom'
    )
  // if (options.left)
  //   appendTriggerDiv(
  //     el,
  //     {
  //       width: '5px',
  //       height: '100%',
  //       position: 'absolute',
  //       background: "#00000024",
  //       cursor: 'col-resize',
  //       left: 0
  //     },
  //     'left'
  //   )
}

export const Debug = ({
  draggable = true,
  scaleable = { right: true, bottom: true },
  ...props
}) => {
  const ref = React.useRef()
  React.useEffect(() => {
    if (draggable) makeDraggable(ref.current)
    if (scaleable) makeScaleable(ref.current, scaleable)
  }, [draggable, scaleable])
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: 200,
        height: 100,
        background: 'dodgerblue',
        transform: 'translate(280px)',
        transition: 'all 800ms 1s',
        cursor: 'help'
      }}
      {...props}
    />
  )
}
