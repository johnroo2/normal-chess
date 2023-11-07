export const retrieveSizes = (size:number) => {
    return {
    tileSize: size,
    boardSize: (8 * size) + 4,
    paletteSize: (0.45 * size),
    text1: (0.28 * size),
    text2: (0.35 * size),
    text3: (0.42 * size)
}}