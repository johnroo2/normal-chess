import { boardConfig } from "../data/boardThemes"

interface Props{
    white:boolean;
    xpos:number;
    ypos:number;
}

export default function Promotion({white, xpos, ypos}:Props){
    const prefix = () => white ? "light-pieces/l" : "dark-pieces/d"

    const imgProps = {
        minWidth: boardConfig.promotionSize,
        minHeight: boardConfig.promotionSize,
    }

    return(
        <div className="absolute p-4 bg-white rounded-md z-[200] flex flex-row gap-2 w-min"
        style={{
            left:`${xpos}px`,
            right: `${ypos}px`
        }}>
            <div className="flex flex-col gap-3">
                <img src={`/assets/images/${prefix()}knight.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}/>
                <img src={`/assets/images/${prefix()}bishop.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}/>
            </div>
            <div className="flex flex-col gap-3">
                <img src={`/assets/images/${prefix()}queen.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}/>
                <img src={`/assets/images/${prefix()}rook.png`}
                className={white ? "white-piece" : "black-piece"}
                style={imgProps}/>
            </div>
        </div>
    )
}