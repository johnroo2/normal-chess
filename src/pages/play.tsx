import { useState } from "react"
import Board from "../components/board"
import BlankBoard from "../components/blankboard"
import { boardConfig, boardColors, boardThemes } from "../helpers/boardThemes"
import { convert } from "../helpers/pieceData"
import { MdComputer } from "react-icons/md"
import { BsFillPeopleFill } from "react-icons/bs"
import { PiArrowsDownUp } from "react-icons/pi"
import { HiOutlineRefresh } from "react-icons/hi"
import { AiOutlineHome } from "react-icons/ai"
import { ImBlocked } from "react-icons/im"

export default function Play(){
    const [theme, setTheme] = useState<string>("brown")
    const [displayBoard, setDisplayBoard] = useState<number[][]>(boardConfig.defaultDisplay)
    const [board, setBoard] = useState<any[][]>(convert(boardConfig.defaultDisplay))
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
        moveList, setMoveList, flipActive, setFlipActive, gameState, setGameState, pastDisplays, setPastDisplays };

    return(
        <div className="relative flex w-screen h-screen justify-center items-center bg-neutral-100">
            <div className="flex flex-col items-start gap-4">
                <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row gap-2">
                        {boardColors.map((key, index) => 
                        <button key={index} className="rounded-full border-neutral-700 hover:scale-[1.2] transition-all duration-300"
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
                            opacity: gameState === "main" ? 1 : 0
                        }}>

                        </div>
                        <span className="transition-all duration-300" style={{
                            fontSize: boardConfig.text1,
                            opacity: gameState === "main" ? 1 : 0
                        }}>
                            {turn % 2 === 0 ? "WHITE" : "BLACK"} to move
                        </span>
                        <button className="relative ml-4 hover:scale-[1.2] transition-all duration-300" style={{fontSize: boardConfig.text2}}
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
                        <button className="ml-2 hover:scale-[1.2] transition-all duration-300" style={{fontSize: boardConfig.text2}}
                        onClick={() => {
                            reset()
                        }}>
                            <HiOutlineRefresh/>
                        </button>
                        <button className="ml-2 hover:scale-[1.2] transition-all duration-300" style={{fontSize: boardConfig.text2}}
                        onClick={() => {
                            reset()
                            setGameState("start")
                        }}>
                            <AiOutlineHome/>
                        </button>
                    </div>
                </div>
                <div className="flex flex-row gap-12">
                    {gameState === "main" ? 
                    <Board {...props}/> :
                    gameState === "start" ? 
                    <div className="relative max-w-[644px] max-h-[644px]">
                        <BlankBoard theme={theme}/>
                        <div className="absolute flex items-center justify-center w-full h-full top-0 left-0 bg-neutral-700/[0.3] z-[400]">
                            <div className="bg-white px-[7rem] py-8 flex flex-col items-center">
                                <span className="text-2xl font-semibold">
                                    Normal Chess
                                </span>
                                <div className="flex flex-col gap-4 mt-4 items-center">
                                    <button className="flex flex-row gap-2 items-center justify-center px-8 py-1 text-lg border-2 
                                    border-neutral-400 bg-neutral-200 text-neutral-400 hover:bg-neutral-200 w-[200px] cursor-not-allowed"
                                    disabled={true}
                                    onClick={() => {
                                        reset()
                                        setGameState("main")
                                    }}>
                                        <MdComputer/>
                                        Singleplayer
                                    </button>
                                    <button className="flex flex-row gap-2 items-center justify-center px-8 py-1 text-lg border-2 
                                    border-neutral-400 bg-neutral-100 hover:bg-neutral-200 w-[200px]"
                                    onClick={() => {
                                        reset()
                                        setGameState("main")
                                    }}>
                                        <BsFillPeopleFill/>
                                        Pass & Play
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>:
                    <div className="relative max-w-[644px] max-h-[644px]">
                        <Board {...props}/>
                        <div className="absolute flex items-center justify-center w-full h-full top-0 left-0 bg-neutral-700/[0.3] z-[400]">
                            <div className="bg-white px-[7rem] py-8 flex flex-col items-center">
                                <span className="text-2xl font-semibold">{gameState.startsWith("checkmate") ? 
                                (gameState.endsWith("white") ? "White Wins!" : "Black Wins!") : "Draw!"}</span>
                                <span className="text-lg italic">{gameState.startsWith("checkmate") ? "By Checkmate" : 
                                gameState === "threefold" ? "By Threefold Repetition" : "By Stalemate"}</span>
                                <button className="px-8 py-1 text-lg mt-8 border-2 border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
                                onClick={() => {
                                    reset()
                                    setGameState("start")
                                }}>
                                    New Game
                                </button>
                            </div>
                        </div>
                    </div>}
                    <div className="flex flex-col gap-2 bg-neutral-200 w-[350px] p-8 overflow-y-scroll max-h-[644px]">
                        {splitPairs(moveList).map((pair:any[], key:number) => {
                            return(
                                <div className="grid w-full"
                                key={key}
                                style={{
                                    gridTemplateColumns: "20% 40% 40%"
                                }}>
                                    <span className="font-semibold text-lg">{key+1}.</span>
                                    <span className="text-lg">{pair[0]}</span>
                                    {pair[1] && <span className="text-lg">{pair[1]}</span>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}