
export const getInitialTablePosition = (index, windowHeight) => {
    let dy = 100 * index
    let dx = 0
    //Math.floor(dy / (windowHeight - 100))是第幾個Ｘ行
    dx = 100 * Math.floor(dy / (windowHeight - 100))
    if (Math.floor(dy / (windowHeight - 100)) >= 1) {
        dy = 100 * Math.ceil(index - Math.floor(windowHeight / 100) * Math.floor(dy / (windowHeight - 100)) + Math.floor(dy / (windowHeight - 100)) - 1)
    }
    return {x: dx, y: dy}
}

export const getTablePosition = (table, windowWidth, windowHeight) => {

    return {x: Number(table.position.x * windowWidth), y: Number(table.position.y * windowHeight)}
}

export const getSetPosition = (screenPosition, windowWidth, windowHeight) => {

    return {x: Number(screenPosition.x * windowWidth), y: Number(screenPosition.y * windowHeight)}
}

export const getModNum = (num, mod) => {
    let tempNum = num
    if (num < 0) {
        tempNum = 0
    }
    tempNum = tempNum - (tempNum % mod)
    return tempNum
}