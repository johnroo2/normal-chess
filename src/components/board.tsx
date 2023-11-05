import { useState, useEffect} from "react"
import { boardThemes, boardColors, boardConfig } from "../data/boardThemes"
import { pieceData, convert } from "../data/pieceMaps"
import Promotion from "./promotion"

export default function displayBoard(){
    const [theme, setTheme] = useState<string>("brown")
    const [displayBoard, setDisplayBoard] = useState<number[][]>(boardConfig.defaultDisplay)
    const [board, setBoard] = useState<any[][]>(convert(boardConfig.defaultDisplay))
    const [pieceMotion, setPieceMotion] = useState<{arr:number[][], source:number[]}>({arr:[], source: []})
    const [turn, setTurn] = useState<number>(0)
    const [flipActive, setFlipActive] = useState<boolean>(false)
    const [moveList, setMoveList] = useState<string[]>([])

    const splitPairs = (arr:any[]) => {
        const pairs = [];
        for (let i = 0; i < arr.length; i += 2) {
            if (i + 1 < arr.length) {
                pairs.push([arr[i], arr[i + 1]]);
            } else {
                pairs.push([arr[i]]);
            }
        }
        return pairs;
    };

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
            if(objcode === 10 && Math.abs(x-initx) >= 2){ //castle
                if(x > initx){clone[y][5] = prev[y][7]; clone[y][7] = prev[y][5]} //kingside
                else{clone[y][3] = prev[y][0]; clone[y][0] = prev[y][3]} //queenside
            }
            return clone
        })
        setBoard((prev:any) => {
            const clone = relocateInitial(prev, null)
            if(objcode === 1){clone[y][x] = {...clone[y][x], firstmove:false}} //pawn firstmove
            if(objcode === 10){clone[y][x] = {...clone[y][x], displaced:true}} //king displacement
            if(objcode === 10 && Math.abs(x-initx) >= 2){ //castle
                if(x > initx){clone[y][5] = prev[y][7]; clone[y][7] = prev[y][5]} //kingside
                else{clone[y][3] = prev[y][0]; clone[y][0] = prev[y][3]} //queenside
            }
            return clone
        })

        const isCapture = () => {
            if(objcode === 1){
                return targetcode !== 0 ? `x${boardConfig.columns[x]}` : ""
            }
            return targetcode !== 0 ? "x" : ""
        }
        const checkStatus = () => {
            return ""
        }
        
        const moveInsert = () => {
            if(objcode === 10 && Math.abs(x-initx) >= 2){
                if(x > initx){return `O-O${checkStatus()}`}
                else{return `O-O-O${checkStatus()}`}
            }
            if(objcode === 1){
                return `${boardConfig.columns[initx]}${isCapture()}${8-y}${checkStatus()}`
            }
            else{
                return `${pieceData[objcode].prefix}${isCapture()}${boardConfig.columns[x]}${8-y}${checkStatus()}`
            }
        }

        setTurn((prev) => prev + 1)
        setMoveList((prev) => [...prev, `${moveInsert()}`])
        setPieceMotion({arr:[], source:[]})
    }

    useEffect(() => {
        //console.log(board)
    }, [board])

    return(
        <div className="flex flex-row gap-12">
            {/* <Promotion white={false} xpos={100} ypos={100}/> */}
            <div className="flex flex-col items-start gap-4">
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row gap-2">
                        {boardColors.map((key, index) => 
                        <button key={index} className="rounded-full border-neutral-700 hover:scale-110 transition-all duration-300"
                        style={{
                            backgroundColor: boardThemes[key].alt,
                            width: boardConfig.paletteSize,
                            height: boardConfig.paletteSize,
                            borderWidth: theme === key ? "3px" : "2px",
                            filter: theme === key ? "brightness(0.9)" : "brightness(1)"
                        }}
                        onClick={() => {setTheme(key)}}/>)}
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className={`border-2 border-neutral-700 ${turn % 2 === 0 ? "bg-neutral-100" : "bg-neutral-700"} transition-all duration-300`}
                        style={{
                            width: boardConfig.text1,
                            height: boardConfig.text1,
                        }}>

                        </div>
                        <span style={{
                            fontSize: boardConfig.text1
                        }}>
                            {turn % 2 === 0 ? "WHITE" : "BLACK"} to move
                        </span>
                    </div>
                </div>
                <div className="flex flex-col border-2 border-neutral-700 w-min">
                    {(!flipActive || turn % 2 == 0 ? displayBoard : [...displayBoard].reverse()).map((row, rkey) => 
                        <div className="flex flex-row" key={rkey}>
                            {row.map((pos, ckey) => {
                                let x = ckey; 
                                let y = !flipActive || turn % 2 == 0 ? rkey : 7-rkey;
                                return(
                                    <div className={`relative border-[1px] transition-colors duration-500 border-neutral-700`} key={ckey}
                                    style={{
                                        backgroundColor: (ckey + rkey) % 2 == 0 ? boardThemes[theme].light : boardThemes[theme].alt,
                                        width: boardConfig.tileSize,
                                        height: boardConfig.tileSize
                                    }}>
                                        {pos !== 0 &&
                                        <div className="absolute w-full h-full top-0 left-0 bg-transparent z-[5]">
                                            {pos > 0 ?
                                            <img src={`/assets/images/light-pieces/l${pieceData[pos].img_string}.png`}
                                            className="w-full h-full white-piece"
                                            onClick={() => {
                                                if(turn % 2 == 0){
                                                    handlePieceClick(x, y)
                                                }
                                            }}/>:
                                            <img src={`/assets/images/dark-pieces/d${pieceData[-pos].img_string}.png`}
                                            className="w-full h-full black-piece"
                                            onClick={() => {
                                                if(turn % 2 == 1){
                                                    handlePieceClick(x, y)
                                                }
                                            }}/>}
                                        </div>}
                                        {pieceMotion.arr.filter((item:number[]) => item[0] === x && item[1] === y).length > 0 &&
                                        <div className="absolute w-full h-full top-0 left-0 z-[30]">
                                            <button className="flex items-center justify-center w-full h-full"
                                            onClick={() => {
                                                handleMove(x, y, pieceMotion.source[0], pieceMotion.source[1])
                                            }}>
                                                <div className="w-[20%] h-[20%] bg-neutral-400/[0.8] rounded-full"/>
                                            </button>
                                        </div>
                                        }
                                        {pieceMotion.source[0] === x && pieceMotion.source[1] === y &&
                                        <div className="absolute w-full h-full top-0 left-0 z-[10]">
                                            <button className="flex items-center justify-center w-full h-full bg-sky-200/[0.45]"
                                            onClick={() => {
                                                setPieceMotion({arr:[], source:[]})
                                            }}>
                                                <div className="w-[20%] h-[20%] bg-transparent rounded-full"/>
                                            </button>
                                        </div>
                                        }
                                </div>
                                )}
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 bg-neutral-200 w-[350px] p-8 overflow-y-scroll">
                {splitPairs(moveList).map((pair:any[], key:number) => {
                    return(
                        <div className="flex flex-row gap-4" key={key}>
                            <span className="font-semibold text-lg">{key+1}.</span>
                            <div className="w-full grid grid-cols-2">
                                <span className="text-lg">{pair[0]}</span>
                                {pair[1] && <span className="text-lg">{pair[1]}</span>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}