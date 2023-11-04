import { useState } from "react"

export default function Board(){
    const colors: { [key: string]: any } = {
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
        }
    };
    const [theme, setTheme] = useState<string>("neutral")

    const board = [[0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],]

    return(
        <div className="flex flex-col items-start gap-6">
            <div className="flex flex-row gap-4">
                {Object.keys(colors).map((key, index) => 
                <button key={index} className="w-[40px] h-[40px] rounded-full border-2 border-neutral-700 hover:brightness-105"
                style={{backgroundColor: colors[key].alt}}
                onClick={() => {setTheme(key)}}/>)}
            </div>
            <div className="flex flex-col border-2 border-neutral-700 w-min">
                {board.map((row, rkey) => 
                    <div className="flex flex-row" key={rkey}>
                        {row.map((pos, ckey) => 
                        <div className={`relative w-[75px] h-[75px] border-[1px] border-neutral-700 transition-colors`} key={ckey}
                        style={{
                            backgroundColor: (ckey + rkey) % 2 == 0 ? colors[theme].light : colors[theme].alt
                        }}>
                            {pos !== 0 &&
                            <div className="absolute w-full h-full top-0 left-0 bg-transparent">

                            </div>}
                        </div>)}
                    </div>
                )}
            </div>
        </div>
    )
}