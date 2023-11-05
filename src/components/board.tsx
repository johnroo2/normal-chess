import { useState, useEffect} from "react"
import { boardThemes, boardColors, boardConfig } from "../data/boardThemes"
import { pieceData, convert } from "../data/pieceMaps"

export default function displayBoard(){
    const [theme, setTheme] = useState<string>("neutral")
    const [displayBoard, setDisplayBoard] = useState<number[][]>(boardConfig.defaultDisplay)
    const [board, setBoard] = useState<any[][]>(convert(boardConfig.defaultDisplay))
    const [pieceMotion, setPieceMotion] = useState<{arr:number[][], source:number[]}>({arr:[], source: []})

    const handlePieceClick = (x:number, y:number) => {
        const code = Math.abs(displayBoard[y][x]);
        setPieceMotion({arr: pieceData[code].movement(x, y, displayBoard, {
            white: displayBoard[y][x] > 0,
            safety: true,
            ...board[y][x]
        }), source: [x, y]})
    }

    const handleMove = async(x:number, y:number, initx:number, inity:number) => {
        const objcode = Math.abs(displayBoard[inity][initx]);
        const targetcode = Math.abs(displayBoard[y][x]);
        const relocateInitial = (prev:any, blank:any) => {
            let clone = [...prev.map((row:any[]) => [...row])]
            clone[y][x] = prev[inity][initx]
            clone[inity][initx] = targetcode === 0 ? prev[y][x] : blank
            return clone
        }

        setDisplayBoard((prev:any) => {
            const clone = relocateInitial(prev, 0)
            return clone
        })
        setBoard((prev:any) => {
            const clone = relocateInitial(prev, null)
            if(objcode === 1){clone[y][x] = {...clone[y][x], firstmove:false}} //pawn firstmove
            if(objcode === 10){clone[y][x] = {...clone[y][x], displaced:true}} //king displacement
            return clone
        })
        if(objcode === 10 && Math.abs(x-initx) >= 2){ //castle
            if(x > initx){handleMove(5, y, 7, y)} //kingside
            else{handleMove(3, y, 0, y)} //queenside
            return
        }
        setPieceMotion({arr:[], source:[]})
    }

    useEffect(() => {
        //console.log(board)
    }, [board])

    return(
        <div className="flex flex-col items-start gap-4">
            <div className="flex flex-row gap-2">
                {boardColors.map((key, index) => 
                <button key={index} className="rounded-full border-2 border-neutral-700 hover:brightness-105"
                style={{
                    backgroundColor: boardThemes[key].alt,
                    width: boardConfig.paletteSize,
                    height: boardConfig.paletteSize
                }}
                onClick={() => {setTheme(key)}}/>)}
            </div>
            <div className="flex flex-col border-2 border-neutral-700 w-min">
                {displayBoard.map((row, rkey) => 
                    <div className="flex flex-row" key={rkey}>
                        {row.map((pos, ckey) => 
                        <div className={`relative border-[1px] border-neutral-700 transition-colors duration-500`} key={ckey}
                        style={{
                            backgroundColor: (ckey + rkey) % 2 == 0 ? boardThemes[theme].light : boardThemes[theme].alt,
                            width: boardConfig.tileSize,
                            height: boardConfig.tileSize
                        }}>
                            {pos !== 0 &&
                            <div className="absolute w-full h-full top-0 left-0 bg-transparent">
                                {pos > 0 ?
                                <img src={`/assets/images/light-pieces/l${pieceData[pos].img_string}.png`}
                                className="w-full h-full white-piece"
                                onClick={() => {handlePieceClick(ckey, rkey)}}/>:
                                <img src={`/assets/images/dark-pieces/d${pieceData[-pos].img_string}.png`}
                                className="w-full h-full black-piece"
                                onClick={() => {handlePieceClick(ckey, rkey)}}/>
                                }
                            </div>}
                            {pieceMotion.arr.filter((item:number[]) => item[0] === ckey && item[1] === rkey).length > 0 &&
                            <div className="absolute w-full h-full top-0 left-0">
                                <button className="flex items-center justify-center w-full h-full"
                                onClick={() => {
                                    handleMove(ckey, rkey, pieceMotion.source[0], pieceMotion.source[1])
                                }}>
                                    <div className="w-[20%] h-[20%] bg-neutral-400/[0.8] rounded-full"/>
                                </button>
                            </div>
                            }
                            {pieceMotion.source[0] === ckey && pieceMotion.source[1] === rkey &&
                            <div className="absolute w-full h-full top-0 left-0">
                                <button className="flex items-center justify-center w-full h-full"
                                onClick={() => {
                                    setPieceMotion({arr:[], source:[]})
                                }}>
                                    <div className="w-[20%] h-[20%] bg-transparent rounded-full"/>
                                </button>
                            </div>
                            }
                        </div>)}
                    </div>
                )}
            </div>
        </div>
    )
}