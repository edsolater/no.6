import React from 'react'

/**
 *  * 核心概念：el监听鼠标按下的事件、document监听鼠标按下后移动的事件
 * */
function makeDraggable(el) {
  // 暂存cursor设置、transition设置
  const configedCursor = el.style.cursor
  const configedTransition = el.style.transition

  // 换成‘拖拽’手势
  el.style.cursor = configedCursor || 'grab'

  // 声明变量，已储存地址链接
  let handler

  //* el监听mousedown事件
  el.addEventListener('mousedown', e => {
    // 禁用 Transition 设置（不然会拖拽不能）
    el.style.transition = undefined

    // 提取上一次/初始transform的值
    let prevTransform = el.style.transform || ''

    // 找出上一次transform中translate的值
    const matched =
      prevTransform.match(/(.*)translate\((\d+)px(?:, (\d+)px)?\)(.*)/) || []
    const otherTransformLeft = String(matched[1] || '')
    const preTransX = Number(matched[2] || 0)
    const preTransY = Number(matched[3] || 0)
    const otherTransformRight = String(matched[4] || '')
    const mousedownX = e.x
    const mousedownY = e.y

    // 换成正在拖拽的手势
    el.style.cursor = configedCursor || 'grabbing'

    //  定义推拽时的handler
    function handleMouseMove(e) {
      const newTransX = e.x - mousedownX + preTransX
      const newTransY = e.y - mousedownY + preTransY
      el.style.transform = `${otherTransformLeft}translate(${newTransX}px, ${newTransY}px)${otherTransformRight}`
    }
    handler = handleMouseMove // 上抛引用

    //* document上监听鼠标移动事件。（不能在el上监听，以防止鼠标移得太快而移出el的范围）
    document.addEventListener('mousemove', handler)
  })

  //* el监听mouseup事件
  el.addEventListener('mouseup', e => {
    el.style.cursor = configedCursor || 'grab'
    el.style.transition = configedTransition
    //* 释放无用的 document event: mousemove，以减轻 mouseup 的负担
    document.removeEventListener('mousemove', handler)
  })
}

export const Debug = ({ draggable = true, ...props }) => {
  const ref = React.useRef()
  React.useEffect(() => {
    if (draggable) makeDraggable(ref.current)
  }, [])
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 100,
        background: 'dodgerblue',
        transform: 'translate(280px) rotate(45deg)',
        transition: 'all 800ms 1s'
        // cursor: 'help'
      }}
      {...props}
    />
  )
}
