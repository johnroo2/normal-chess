import { useEffect, useState } from "react"
import Board from "../components/board"
import BlankBoard from "../components/blankboard"

import { boardColors, boardThemes, boardConfig } from "../helpers/boardThemes"
import { retrieveSizes } from "../helpers/retrieveSizes"
import { convert } from "../helpers/pieceData"

import useWindowSize from "../hooks/useWindowSize"

import { MdComputer } from "react-icons/md"
import { BsFillPeopleFill } from "react-icons/bs"
import { PiArrowsDownUp } from "react-icons/pi"
import { HiOutlineRefresh } from "react-icons/hi"
import { AiOutlineHome } from "react-icons/ai"
import { ImBlocked } from "react-icons/im"

export default function Play(){
    const size = useWindowSize();

    const [theme, setTheme] = useState<string>("brown")
    const [displayBoard, setDisplayBoard] = useState<number[][]>(boardConfig.defaultDisplay)
    const [board, setBoard] = useState<any[][]>(convert(boardConfig.defaultDisplay))
    const [boardSizes, setBoardSizes] = useState<any>(null)
    const [pastDisplays, setPastDisplays] = useState<number[][]>([[].concat(...boardConfig.defaultDisplay as any[])])
    const [turn, setTurn] = useState<number>(0)
    const [moveList, setMoveList] = useState<string[]>([]) 
    const [flipActive, setFlipActive] = useState<boolean>(false)

    const [gameState, setGameState] = useState<string>("start")

    const reset = () => {
        setDisplayBoard(boardConfig.defaultDisplay)
        setBoard(convert(boardConfig.defaultDisplay))
        setTurn(0)
        setMoveList([])
        setPastDisplays([[].concat(...boardConfig.defaultDisplay as any[])])
    }

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

    const props = { theme, setTheme, displayBoard, setDisplayBoard, board, setBoard, turn, setTurn, 
        moveList, setMoveList, flipActive, setFlipActive, gameState, setGameState, pastDisplays, setPastDisplays,
        boardSizes, setBoardSizes };

    useEffect(() => {
        setBoardSizes(retrieveSizes(size.height/10))
    }, [size])

    if(!boardSizes){
        return
    }
    return(
        <div className="absolute top-0 left-0 flex w-screen h-screen justify-center items-center bg-neutral-100 max-w-screen overflow-scroll">
            <div className="flex flex-col items-start"
            style={{
                gap: boardSizes.tileSize * 0.2
            }}>
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row"
                    style={{
                        gap: boardSizes.tileSize * 0.1
                    }}>
                        {boardColors.map((key, index) => 
                        <button key={index} className="rounded-full border-neutral-700 hover:scale-[1.2] transition-all duration-300"
                        style={{
                            backgroundColor: boardThemes[key].alt,
                            width: boardSizes.paletteSize,
                            height: boardSizes.paletteSize,
                            borderWidth: theme === key ? "2px" : "1px",
                            filter: theme === key ? "brightness(0.9)" : "brightness(1)"
                        }}
                        onClick={() => {setTheme(key)}}/>)}
                    </div>
                    <div className="flex flex-row items-center"
                    style={{
                        gap: boardSizes.tileSize * 0.1
                    }}>
                        <div className={`border-2 border-neutral-700 ${turn % 2 === 0 ? "bg-neutral-100" : "bg-neutral-700"} transition-all duration-300`}
                        style={{
                            width: `${boardSizes.text1}px`,
                            height: `${boardSizes.text1}px`,
                            opacity: gameState === "main" ? 1 : 0
                        }}>

                        </div>
                        <span className="transition-all duration-300" style={{
                            fontSize: `${boardSizes.text1}px`,
                            opacity: gameState === "main" ? 1 : 0
                        }}>
                            {turn % 2 === 0 ? "WHITE" : "BLACK"} to move
                        </span>
                        <button className="relative ml-4 hover:scale-[1.2] transition-all duration-300" style={{fontSize: `${boardSizes.text2}px`}}
                        onClick={() => {
                            setFlipActive(prev => !prev)
                        }}>
                            <PiArrowsDownUp/>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity"
                            style={{
                                opacity: !flipActive ? 0.8 : 0
                            }}>
                                <div className="scale-95">
                                    <ImBlocked/>
                                </div>
                            </div>
                        </button>
                        <button className="ml-2 hover:scale-[1.2] transition-all duration-300" style={{fontSize: `${boardSizes.text2}px`}}
                        onClick={() => {
                            reset()
                        }}>
                            <HiOutlineRefresh/>
                        </button>
                        <button className="ml-2 hover:scale-[1.2] transition-all duration-300" style={{fontSize: `${boardSizes.text2}px`}}
                        onClick={() => {
                            reset()
                            setGameState("start")
                        }}>
                            <AiOutlineHome/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-row"
                style={{
                    gap: boardSizes.tileSize * 0.5
                }}>
                    {gameState === "main" ? 
                    <Board {...props}/> :
                    gameState === "start" ? 
                    <div className="relative"
                    style={{
                        maxWidth: boardSizes.boardSize,
                        maxHeight: boardSizes.boardSize
                    }}>
                        <BlankBoard theme={theme} boardSizes={boardSizes}/>
                        <div className="absolute flex items-center justify-center w-full h-full top-0 left-0 bg-neutral-700/[0.3] z-[400]">
                            <div className="bg-white flex flex-col items-center"
                            style={{
                                paddingTop: boardSizes.tileSize * 0.6,
                                paddingBottom: boardSizes.tileSize * 0.85,
                                paddingLeft: boardSizes.tileSize * 0.55,
                                paddingRight: boardSizes.tileSize * 0.55
                            }}>
                                <span className="font-semibold"
                                style={{
                                    fontSize: boardSizes.text3
                                }}>
                                    Normal Chess
                                </span>
                                <div className="flex flex-col items-center"
                                style={{
                                    gap: boardSizes.tileSize * 0.2,
                                    marginTop: boardSizes.tileSize * 0.2
                                }}>
                                    <button className="flex flex-row items-center justify-center border-2 
                                    border-neutral-400 bg-neutral-200 text-neutral-400 hover:bg-neutral-200 cursor-not-allowed"
                                    disabled={true}
                                    onClick={() => {
                                        reset()
                                        setGameState("main")
                                    }}
                                    style={{
                                        gap: boardSizes.tileSize * 0.1,
                                        fontSize: boardSizes.text1,
                                        width: boardSizes.tileSize * 4,
                                        height: boardSizes.text1 + boardSizes.tileSize * 0.25,
                                        maxHeight: boardSizes.text1 + boardSizes.tileSize * 0.25
                                    }}>
                                        <MdComputer/>
                                        Singleplayer
                                    </button>
                                    <button className="flex flex-row items-center justify-center border-2 
                                    border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
                                    onClick={() => {
                                        reset()
                                        setGameState("main")
                                    }}
                                    style={{
                                        gap: boardSizes.tileSize * 0.1,
                                        fontSize: boardSizes.text1,
                                        width: boardSizes.tileSize * 4,
                                        height: boardSizes.text1 + boardSizes.tileSize * 0.25,
                                        maxHeight: boardSizes.text1 + boardSizes.tileSize * 0.25
                                    }}>
                                        <BsFillPeopleFill/>
                                        Pass & Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>:
                    <div className="relative"
                    style={{
                        maxWidth: `${boardSizes.boardSize}px`,
                        maxHeight: `${boardSizes.boardSize}px`
                    }}>
                        <Board {...props}/>
                        <div className="absolute flex items-center justify-center w-full h-full top-0 left-0 bg-neutral-700/[0.3] z-[400]">
                            <div className="bg-white flex flex-col items-center "
                            style={{
                                paddingTop: boardSizes.tileSize * 0.6,
                                paddingBottom: boardSizes.tileSize * 0.75,
                                paddingLeft: boardSizes.tileSize * 0.3,
                                paddingRight: boardSizes.tileSize * 0.3
                            }}>
                                <span className="font-semibold" style={{fontSize:boardSizes.text2}}>
                                    {gameState.startsWith("checkmate") ? 
                                    (gameState.endsWith("white") ? 
                                    "White Wins!" : "Black Wins!") : "Draw!"}
                                </span>
                                <span className="italic text-center"
                                style={{
                                    fontSize: boardSizes.text1,
                                    paddingTop: boardSizes.tileSize/20,
                                    paddingBottom: boardSizes.tileSize/20,
                                    width: boardSizes.tileSize * 4.5
                                }}>
                                    {gameState.startsWith("checkmate") ? "By Checkmate" : 
                                    gameState === "threefold" ? "By Threefold Repetition" : "By Stalemate"}
                                </span>
                                <button className="border-2 border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
                                style={{
                                    marginTop: boardSizes.tileSize * 0.3,
                                    fontSize: boardSizes.text1,
                                    paddingTop: boardSizes.tileSize/20,
                                    paddingBottom: boardSizes.tileSize/20,
                                    width: boardSizes.tileSize * 3.5
                                }}
                                onClick={() => {
                                    reset()
                                    setGameState("start")
                                }}>
                                    New Game
                                </button>
                            </div>
                        </div>
                    </div>}
                    <div className="flex flex-col bg-neutral-200 overflow-y-scroll"
                    style={{
                        gap: boardSizes.tileSize * 0.1,
                        maxHeight: boardSizes.boardSize,
                        width: boardSizes.tileSize * 4.25,
                        padding: boardSizes.tileSize * 0.35,
                    }}>
                        {splitPairs(moveList).map((pair:any[], key:number) => {
                            return(
                                <div className="grid w-full"
                                key={key}
                                style={{
                                    gridTemplateColumns: "20% 40% 40%",
                                    fontSize: boardSizes.text1
                                }}>
                                    <span className="font-semibold">{key+1}.</span>
                                    <span>{pair[0]}</span>
                                    {pair[1] && <span>{pair[1]}</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}