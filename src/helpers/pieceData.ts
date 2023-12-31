const fallen = (x:number, y:number) => {
    return x < 0 || x >= 8 || y < 0 || y >= 8
}

const occupied = (x:number, y:number, board:number[][]) => {
    return board[y] && board[y][x] !== 0
}

const captureEnemy = (x:number, y:number, initx:number, inity:number, board:number[][]) => {
    return (board[inity][initx] < 0 && board[y] && board[y][x] >= 0) ||
    (board[inity][initx] > 0 && board[y] && board[y][x] <= 0)
}

const blocked = (x:number, y:number, board:number[][]) => {
    return occupied(x, y, board) || fallen(x,y)
}

const insertable = (x:number, y:number, initx:number, inity:number, safety: boolean, board:number[][]) => {
    return (!blocked(x, y, board) || captureEnemy(x, y, initx, inity, board)) 
    && !endangers(x, y, initx, inity, safety, board)
}

const moveable = (x:number, y:number, initx:number, inity:number, safety:boolean, board:number[][]) => {
    return !blocked(x, y, board) && !endangers(x, y, initx, inity, safety, board)
}

const attacked = (x:number, y:number, initx:number, inity:number, board:number[][]) => {
    let output = 0
    let clone = [...board.map((row:any[]) => [...row])]
    
    clone.forEach((row:number[], rkey:number) => {
        row.forEach((square:number, ckey:number) => {
            if(captureEnemy(ckey, rkey, initx, inity, clone) && square !== 0){ //if opposite sides
                const code = Math.abs(square)
                if(code !== 10){ //if not a king (avoid recursion)
                    const occupies = pieceData[code].movement(ckey, rkey, clone, 
                        {white: square > 0, safety:false, 
                            pawn_mirage: true})
                    if(occupies.filter((pos:number[]) => {return pos[0] === x && pos[1] === y}).length > 0){
                        output += 1
                    }
                }
                else{
                    if(Math.abs(ckey-x) <= 1 && Math.abs(rkey-y) <= 1){
                        output += 1
                    }
                }
            }
        })
    })
    return output
}

const endangers = (x:number, y:number, initx:number, inity:number, safety:boolean, board:number[][]) => {
    if(!safety){
        return false
    }
    let px = -1; let py = -1;
    if(Math.abs(board[inity][initx]) === 10){ //adjust king movement
        px = x; py = y;
    }
    else{
        //get king coords
        board.forEach((row:number[], rkey:number) => {
            row.forEach((square:number, ckey:number) => {
                const code = Math.abs(square)
                if(!captureEnemy(initx, inity, ckey, rkey, board)){ //same side
                    if(code === 10){
                        px = ckey; py = rkey
                    }
                }
            })
        })
    }
    // no king?
    if(px < 0 || py < 0){
        console.log("no king?")
        return true
    }
    //perform movement
    let clone = [...board.map((row:any[]) => [...row])]
    clone[y][x] = board[inity][initx]
    clone[inity][initx] = board[y][x]
    if(board[y][x] !== 0){clone[inity][initx] = 0}
    return attacked(px, py, px, py, clone) >= 1 //determine if king is safe
}

function pawnMovement(x:number, y:number, board:number[][], props:any){
    let output:number[][] = [];
    if(props.white){
        if(!props.pawn_mirage && props.firstmove && moveable(x, y-1, x, y, props.safety, board) && moveable(x, y-2, x, y, props.safety, board)){output.push([x, y-2])}
        if(!props.pawn_mirage && moveable(x, y-1, x, y, props.safety, board)){output.push([x, y-1])}
        if(props.pawn_mirage || (occupied(x-1, y-1, board) && insertable(x-1, y-1, x, y, props.safety, board))){output.push([x-1, y-1])}
        if(props.pawn_mirage || (occupied(x+1, y-1, board) && insertable(x+1, y-1, x, y, props.safety, board))){output.push([x+1, y-1])}

        //passant
        if(props.passants){
            props.passants.forEach((pos:number[]) => {
            if(pos[0] === x-1 && pos[1] === y && moveable(x-1, y-1, x, y, props.safety, board) 
            && captureEnemy(x-1, y, x, y, board)){output.push([x-1, y-1])}
            if(pos[0] === x+1 && pos[1] === y && moveable(x+1, y-1, x, y, props.safety, board) 
            && captureEnemy(x+1, y, x, y, board)){output.push([x+1, y-1])}
        })}
    }
    else{
        if(!props.pawn_mirage && props.firstmove && moveable(x, y+1, x, y, props.safety, board) && moveable(x, y+2, x, y, props.safety, board)){output.push([x, y+2])}
        if(!props.pawn_mirage && moveable(x, y+1, x, y, props.safety, board)){output.push([x, y+1])}
        if(props.pawn_mirage || (occupied(x-1, y+1, board) && insertable(x-1, y+1, x, y, props.safety, board))){output.push([x-1, y+1])}
        if(props.pawn_mirage || (occupied(x+1, y+1, board) && insertable(x+1, y+1, x, y, props.safety, board))){output.push([x+1, y+1])}

        if(props.passants){
            props.passants.forEach((pos:number[]) => {
            if(pos[0] === x-1 && pos[1] === y && moveable(x-1, y+1, x, y, props.safety, board) 
            && captureEnemy(x-1, y, x, y, board)){output.push([x-1, y+1])}
            if(pos[0] === x+1 && pos[1] === y && moveable(x+1, y+1, x, y, props.safety, board) 
            && captureEnemy(x+1, y, x, y, board)){output.push([x+1, y+1])}
        })}
    }
    return [...new Set(output)]
}

function knightMovement(x:number, y:number, board:number[][], props:any){
    let output:number[][] = [];
    if(insertable(x-1, y-2, x, y, props.safety, board)){output.push([x-1, y-2])}
    if(insertable(x+1, y-2, x, y, props.safety, board)){output.push([x+1, y-2])}
    if(insertable(x-1, y+2, x, y, props.safety, board)){output.push([x-1, y+2])}
    if(insertable(x+1, y+2, x, y, props.safety, board)){output.push([x+1, y+2])}
    if(insertable(x-2, y-1, x, y, props.safety, board)){output.push([x-2, y-1])}
    if(insertable(x-2, y+1, x, y, props.safety, board)){output.push([x-2, y+1])}
    if(insertable(x+2, y-1, x, y, props.safety, board)){output.push([x+2, y-1])}
    if(insertable(x+2, y+1, x, y, props.safety, board)){output.push([x+2, y+1])}
    return [...output]
}

//TODO: CASTLING
function kingMovement(x:number, y:number, board:number[][], props:any){
    let output:number[][] = [];
    if(insertable(x-1, y-1, x, y, props.safety, board)){output.push([x-1, y-1])}
    if(insertable(x-1, y, x, y, props.safety, board)){output.push([x-1, y])}
    if(insertable(x-1, y+1, x, y, props.safety, board)){output.push([x-1, y+1])}
    if(insertable(x, y-1, x, y, props.safety, board)){output.push([x, y-1])}
    if(insertable(x, y+1, x, y, props.safety, board)){output.push([x, y+1])}
    if(insertable(x+1, y-1, x, y, props.safety, board)){output.push([x+1, y-1])}
    if(insertable(x+1, y, x, y, props.safety, board)){output.push([x+1, y])}
    if(insertable(x+1, y+1, x, y, props.safety, board)){output.push([x+1, y+1])}
    if(!props.displaced){
        if(moveable(x+1, y, x, y, props.safety, board) && moveable(x+2, y, x, y, props.safety, board) && 
        !(attacked(x+1, y, x, y, board) >= 1) && !(attacked(x+2, y, x, y, board) >= 1) && 
        (board[y][7] === props.white ? 5 : -5)){
            if(!props.kingside_displaced){
                output.push([x+2, y])
            }
        } //kingside
        if(moveable(x-1, y, x, y, props.safety, board) && moveable(x-2, y, x, y, props.safety, board) && 
        !(attacked(x-1, y, x, y, board) >= 1) && !(attacked(x-2, y, x, y, board) >= 1) && 
        (board[y][0] === props.white ? 5 : -5)){
            if(!props.queenside_displaced){
                output.push([x-2, y])
            }
        } //queenside
    }
    return [...output]
}

function bishopMovement(x:number, y:number, board:number[][], props:any){
    let output:number[][] = [];
    const initx = x;
    const inity = y;
    function topLeft(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            topLeft(x-1, y-1)
        }
        return
    }
    function topRight(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            topRight(x+1, y-1)
        }
        return
    }
    function bottomLeft(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            bottomLeft(x-1, y+1)
        }
        return
    }
    function bottomRight(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            bottomRight(x+1, y+1)
        }
        return
    }
    topLeft(x-1, y-1); topRight(x+1, y-1); bottomLeft(x-1, y+1); bottomRight(x+1, y+1);
    return [...output]
}

function rookMovement(x:number, y:number, board:number[][], props:any){
    const initx = x;
    const inity = y;
    let output:number[][] = [];
    function up(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            up(x, y-1)
        }
        return
    }
    function down(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            down(x, y+1)
        }
        return
    }
    function left(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            left(x-1, y)
        }
        return
    }
    function right(x:number, y:number){
        if(insertable(x, y, initx, inity, props.safety, board)){
            output.push([x, y])
        }
        if(!blocked(x, y, board)){
            right(x+1, y)
        }
        return
    }
    up(x, y-1); down(x, y+1); left(x-1, y), right(x+1, y)
    return [...output]
}

function queenMovement(x:number, y:number, board:number[][], props:any){
    return [...bishopMovement(x,y,board,props), ...rookMovement(x,y,board,props)]
}

export const sourcePotential = (x:number, y:number, initx:number, inity:number, columns:string[], board:number[][]) => {
    const output:number[][] = []
    let clone = [...board.map((row:any[]) => [...row])]

    const source = Math.abs(clone[inity][initx])
    
    clone.forEach((row:number[], rkey:number) => {
        row.forEach((square:number, ckey:number) => {
            if(!captureEnemy(initx, inity, ckey, rkey, board) && square !== 0){ //if same sides
                const code = Math.abs(square)
                if(code !== 10){ //if not a king (avoid recursion)
                    const occupies = pieceData[code].movement(ckey, rkey, clone, 
                        {white: square > 0, safety:false, 
                            pawn_mirage: true})
                    if(occupies.filter((pos:number[]) => {return pos[0] === x && pos[1] === y}).length > 0){
                        if(code === source){output.push([ckey, rkey])}
                    }
                }
                else{
                    if(Math.abs(ckey-x) <= 1 && Math.abs(rkey-y) <= 1){
                        if(code === source){output.push([ckey, rkey])}
                    }
                }
            }
        })
    })

    if(output.length <= 1){return ""}
    let sameColumn = true
    const level = output[0][0]
    output.forEach((pair:number[]) => {
        if(pair[0] !== level){sameColumn = false}
    })
    if(sameColumn){ //return the relevant row if columns indistinguishbale
        return `${y}`
    }
    else{ //otherwise only indicate column
        return `${columns[initx]}`
    }
}

export const inCheck = (board:number[][], checks:number) => {
    let output = 0
    board.forEach((row:number[], rkey:number) => {
        row.forEach((square:number, ckey:number) => {
            const code = Math.abs(square)
            if(code === 10){
                const attack = attacked(ckey, rkey, ckey, rkey, board)
                if(attack > 0){output += attack}
            }
        })
    })
    return output >= checks
}

export const inStalemate = (board:number[][], white:boolean) => {
    let output = true
    board.forEach((row:number[], rkey:number) => {
        row.forEach((square:number, ckey:number) => {
            const code = Math.abs(square)
            if((white ? square : -square) > 0){
                if(pieceData[code].movement(ckey, rkey, board, {
                    white: white,
                    safety: true,
                }).length > 0){
                    output = false
                }
            }
        })
    })
    return output
}

export const inCheckmate = (board:number[][], white:boolean) => inCheck(board, 1) && inStalemate(board, white)

export const pieceData: { [key: number]: any } = {
    1: {
        img_string: "pawn",
        prefix: "",
        movement:pawnMovement,
        base:{
            name: "pawn",
            firstmove: true,
            passantmove: false
        }
    },
    2: {
        img_string: "knight",
        prefix: "N",
        movement:knightMovement,
        base:{
            name: "knight",
            promoted: false
        }
    },
    3: {
        img_string: "bishop",
        prefix: "B",
        movement:bishopMovement,
        base:{
            name: "bishop",
            promoted: false
        }
    },
    5: {
        img_string: "rook",
        prefix: "R",
        movement:rookMovement,
        base:{
            name: "rook",
            displaced:false,
            promoted: false
        }
    },
    9: {
        img_string: "queen",
        prefix: "Q",
        movement:queenMovement,
        base:{
            name: "queen",
            promoted: false
        }
    },
    10:{
        img_string: "king",
        prefix: "K",
        movement:kingMovement,
        base:{
            name: "king",
            displaced: false,
            // kingside: true,
            // queenside: true,
        }
    }
};

export const convert = (board:number[][]) => {
    return board.map((row:number[]) => row.map(square => {
        if(square !== 0){
            return {...pieceData[Math.abs(square)].base}
        }
        return null
    }))
}