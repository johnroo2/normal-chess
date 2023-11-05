
export const boardConfig = {
    tileSize: "80px",
    paletteSize: "32px",
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
}

export const boardThemes: { [key: string]: any } = {
    neutral: {
        light: "#fafafa",
        alt: "#e5e5e5",
    },
    sky: {
        light: "#f0f9ff",
        alt: "#bae6fd",
    },
    green: {
        light: "#f0fdf4",
        alt: "#bbf7d0"
    },
    purple: {
        light: "#faf5ff",
        alt: "#e9d5ff"
    }
};

export const boardColors = Object.keys(boardThemes)