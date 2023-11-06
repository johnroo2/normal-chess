import { useState, useEffect} from "react"
import { boardThemes, boardConfig } from "../helpers/boardThemes"
import { pieceData, inCheck, inStalemate, inCheckmate, sourcePotential } from "../helpers/pieceData"
import repetition from "../helpers/repetitionChecker"
import Promotion from "./promotion"

interface Props{
    theme:string
    setTheme:React.Dispatch<React.SetStateAction<string>>
    displayBoard:number[][]
    setDisplayBoard:React.Dispatch<React.SetStateAction<number[][]>>
    board:any[][]
    setBoard:React.Dispatch<React.SetStateAction<any[][]>>
    turn:number
    setTurn:React.Dispatch<React.SetStateAction<number>>
    moveList:string[]
    setMoveList:React.Dispatch<React.SetStateAction<string[]>>
    flipActive:boolean
    setFlipActive:React.Dispatch<React.SetStateAction<boolean>>
    gameState:string
    setGameState:React.Dispatch<React.SetStateAction<string>>
    pastDisplays:number[][]
    setPastDisplays:React.Dispatch<React.SetStateAction<number[][]>>
}

export default function Board({theme, displayBoard, setDisplayBoard, board, setBoard, 
    turn, setTurn, setMoveList, flipActive, setGameState, pastDisplays, setPastDisplays}:Props){
    // setTheme,
    // setFlipActive,
    // moveList, 
    // gameState}:Props){
    const [pieceMotion, setPieceMotion] = useState<{arr:number[][], source:number[]}>({arr:[], source: []})
    const [promotion, setPromotion] = useState<{white:boolean, init:number, position:number}>({white:true, init: -1, position:-1})

    const getPassants = () => {
        const output:number[][] = []
        board.forEach((row:any[], rkey:number) => [...row.map((square:any, ckey:number) => {
            if(square){
                if(square.passantmove){
                    output.push([ckey, rkey])
                }
            }
        })])
        return output
    }

    const handlePieceClick = (x:number, y:number) => {
        const code = Math.abs(displayBoard[y][x]);
        setPieceMotion({arr: pieceData[code].movement(x, y, displayBoard, {
            white: displayBoard[y][x] > 0,
            safety: true,
            passants: getPassants(),
            ...board[y][x]
        }), source: [x, y]})
    }

    //TODO: THREEFOLD REPETITION
    const checkStatus = (board:any) => {
        if(inCheckmate(board, true)){
            setGameState("checkmate black")
            return "#"
        }
        if(inCheckmate(board, false)){
            setGameState("checkmate white")
            return "#"
        }
        if(inStalemate(board, true) || inStalemate(board, false)){
            setGameState("stalemate")
            return "$"
        }
        if(inCheck(board, 2)){ 
            return "++"
        }
        if(inCheck(board, 1)){ 
            return "+"
        }
        return ""
    }

    const handlePromotion = (output:number) => {
        const initx = promotion.init;
        const x = promotion.position; const y = promotion.white ? 0 : 7;
        const targetcode = Math.abs(displayBoard[y][x]);

        let newDisplay:number[][] = [];

        setDisplayBoard((prev) => {
            let clone:any[] = [...prev.map((row:number[]) => [...row])]
            clone[y][x] = promotion.white ? output : -output; 
            newDisplay = [...clone.map((row:number[]) => [...row])]
            setPastDisplays(prev => [...prev, [].concat(...clone)])
            return clone
        })
        setBoard((prev) => {
            let clone = [...prev.map((row:any[]) => [...row])]
            clone[y][x] = {...pieceData[output].base, promoted:true};
            return clone
        })
        setMoveList((prev) => [...prev, `${boardConfig.columns[initx]}${
            targetcode !== 0 ? `x${boardConfig.columns[x]}` : ""}${8-y}${`=${pieceData[output].prefix}`}
            ${checkStatus(newDisplay)}`])
        setPromotion({white:true, init:-1, position:-1})
    }

    const handleMove = async(x:number, y:number, initx:number, inity:number) => {
        const objcode = Math.abs(displayBoard[inity][initx]);
        const targetcode = Math.abs(displayBoard[y][x]);
        const relocateInitial = (prev:any, blank:any) => {
            let clone = [...prev.map((row:any[]) => [...row])]
            clone[y][x] = prev[inity][initx]
            clone[inity][initx] = targetcode === 0 ? prev[y][x] : blank
            
            //check for en passant
            if(objcode === 1){
                if(displayBoard[inity][initx] > 0){ //white
                    if(displayBoard[y+1][x] === -1){
                        if((x === initx-1 || x === initx+1) && y === inity-1){
                            clone[y+1][x] = blank
                        }
                    }
                }
                else{
                    if(displayBoard[y-1][x] === 1){
                        if((x === initx-1 || x === initx+1) && y === inity+1){
                            clone[y-1][x] = blank
                        }
                    }
                }
            }
            return clone
        }

        let newDisplay:number[][] = [];

        setDisplayBoard((prev:any) => {
            const clone = relocateInitial(prev, 0)
            if(objcode === 10 && Math.abs(x-initx) >= 2){ //castle
                if(x > initx){clone[y][5] = prev[y][7]; clone[y][7] = prev[y][5]} //kingside
                else{clone[y][3] = prev[y][0]; clone[y][0] = prev[y][3]} //queenside
            }
            newDisplay = [...clone.map((row:any[]) => [...row])]
            setPastDisplays(prev => [...prev, [].concat(...clone)])
            return clone
        })
        setBoard((prev:any) => {
            const clone = relocateInitial(prev, null)
            //disable passant moves
            const passantClone = [...clone.map((row:any[]) => [...row.map((square:any) => {
                if(square){
                    if(square.passantmove){
                        return {...square, passantmove:false}
                    }
                    return {...square}
                }
                return square
            })])]
            if(objcode === 1){passantClone[y][x] = {...passantClone[y][x], passantmove:passantClone[y][x].firstmove, firstmove:false}} //pawn firstmove
            if(objcode === 10){passantClone[y][x] = {...passantClone[y][x], displaced:true}} //king displacement
            if(objcode === 10 && Math.abs(x-initx) >= 2){ //castle
                if(x > initx){passantClone[y][5] = prev[y][7]; passantClone[y][7] = prev[y][5]} //kingside
                else{passantClone[y][3] = prev[y][0]; passantClone[y][0] = prev[y][3]} //queenside
            }
            return passantClone
        })

        setTurn((prev) => prev + 1)
        setPieceMotion({arr:[], source:[]})

        const isCapture = () => {
            if(objcode === 1){
                if(displayBoard[inity][initx] > 0){ //white
                    if(displayBoard[y+1][x] === -1){
                        if((x === initx-1 || x === initx+1) && y === inity-1){
                            return `x${boardConfig.columns[x]}`
                        }
                    }
                }
                else{
                    if(displayBoard[y-1][x] === 1){
                        if((x === initx-1 || x === initx+1) && y === inity+1){
                            return `x${boardConfig.columns[x]}`
                        }
                    }
                }
                return targetcode !== 0 ? `x${boardConfig.columns[x]}` : ""
            }
            return targetcode !== 0 ? "x" : ""
        }

        if(objcode === 1){ //promotion
            if(displayBoard[inity][initx] > 0){ //white
                if(y === 0){setPromotion({white:true, init:initx, position:x});return}
            }
            else{ //black
                if(y === 7){setPromotion({white:false, init:initx, position:x});return}
            }
        }
        
        const moveInsert = () => {
            if(objcode === 10 && Math.abs(x-initx) >= 2){
                if(x > initx){return `O-O${checkStatus(newDisplay)}`}
                else{return `O-O-O${checkStatus(newDisplay)}`}
            }
            if(objcode === 1){
                return `${boardConfig.columns[initx]}${isCapture()}${8-y}${checkStatus(newDisplay)}`
            }
            else{
                return `${pieceData[objcode].prefix}${sourcePotential(x, y, initx, inity,
                    boardConfig.columns, displayBoard)}${isCapture()}${boardConfig.columns[x]}${8-y}${checkStatus(newDisplay)}`
            }
        }
        setMoveList((prev) => [...prev, `${moveInsert()}`])
    }

    useEffect(() => {
        if(repetition(pastDisplays)){
            setGameState("threefold")
        }
    }, [pastDisplays])

    return(
        <div className="relative flex flex-col border-2 border-neutral-700 w-min">
            {promotion.position > -1 &&
            <div>
                <div className="fixed top-0 left-0 w-full h-full bg-neutral-700/[0.15] z-[50]"></div>
                <Promotion 
                white={promotion.white} 
                xpos={promotion.position} 
                ypos={0}
                handlePromotion={handlePromotion}/>
            </div>}
            {(!flipActive || turn % 2 == 0 ? displayBoard : [...displayBoard].reverse()).map((row, rkey) => 
                <div className="flex flex-row" key={rkey}>
                    {(!flipActive || turn % 2 == 0 ? row : [...row].reverse()).map((pos, ckey) => {
                        let x = !flipActive || turn % 2 == 0 ? ckey : 7-ckey;
                        let y = !flipActive || turn % 2 == 0 ? rkey : 7-rkey;
                        return(
                            <div className={`relative border-[1px] transition-colors duration-500 border-neutral-700`} key={ckey}
                            style={{
                                backgroundColor: (x+y) % 2 == 0 ? boardThemes[theme].light : boardThemes[theme].alt,
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
    )
}