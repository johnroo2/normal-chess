interface Props{
    white:boolean;
    xpos:number;
    ypos:number;
    handlePromotion: Function;
    boardSizes:any
}

export default function Promotion({white, xpos, handlePromotion, boardSizes}:Props){
    const prefix = () => white ? "light-pieces/l" : "dark-pieces/d"

    const imgProps = {
        minWidth: `${boardSizes.tileSize * 0.8}px`,
        minHeight: `${boardSizes.tileSize * 0.8}px`,
    }

    return(
        <div className="absolute p-4 bg-white/[0.9] rounded-md z-[200] flex flex-row w-min shadow-xl shadow-neutral-700/[0.7]"
        style={{
            gap: boardSizes.tileSize * 0.1,
            left:`${xpos * 80}px`,
            top: `${(white ? 40 : 440)}px`
        }}>
            <div className="flex flex-col"
            style={{
                gap: boardSizes.tileSize * 0.15,
            }}>
                <img src={`/assets/images/${prefix()}knight.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}
                onClick={() => {
                    handlePromotion(2)
                }}/>
                <img src={`/assets/images/${prefix()}bishop.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}
                onClick={() => {
                    handlePromotion(3)
                }}/>
            </div>
            <div className="flex flex-col"
            style={{
                gap: boardSizes.tileSize * 0.15,
            }}>
                <img src={`/assets/images/${prefix()}queen.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}
                onClick={() => {
                    handlePromotion(9)
                }}/>
                <img src={`/assets/images/${prefix()}rook.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}
                onClick={() => {
                    handlePromotion(5)
                }}/>
            </div>
        </div>
    )
}