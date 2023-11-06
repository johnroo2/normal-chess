
export const boardConfig = {
    tileSize: "80px",
    promotionSize: "65px",
    paletteSize: "32px",
    text1: "22px",
    text2: "28px",
    defaultDisplay: [
        [-5, -2, -3, -9, -10, -3, -2, -5],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [5, 2, 3, 9, 10, 3, 2, 5]
    ],
    blank: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    columns: ["a", "b", "c", "d", "e", "f", "g", "h"]
}

export const boardThemes: { [key: string]: any } = {
    brown: {
        light: "#fafafa",
        alt: "#fdba74",
    },
    sky: {
        light: "#eef2ff",
        alt: "#bae6fd",
    },
    green: {
        light: "#fef3c7",
        alt: "#86efac"
    },
    purple: {
        light: "#fff1f2",
        alt: "#d8b4fe"
    },
    red:{
        light:"#fefce8",
        alt:"#fca5a5"
    },
    pink:{
        light: "#ffe0ea",
        alt:"#dfa0c8"
    }
};

export const boardColors = Object.keys(boardThemes)