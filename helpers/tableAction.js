
export const getInitialTablePosition = (index, windowHeight) => {
    let dy = 100 * index
    let dx = 0

    dx = 100 * Math.floor(dy / (windowHeight - 100))
    if (Math.floor(dy / (windowHeight - 100)) >= 1) {
        dy = 100 * Math.ceil(index - Math.floor(windowHeight / 100) * Math.floor(dy / (windowHeight - 100)))
    }
    return {x: dx, y: dy}
}

export const getTablePosition = (table, windowWidth, windowHeight) => {

    return {x: Number(table.position.x * windowWidth), y: Number(table.position.y * windowHeight)}
}