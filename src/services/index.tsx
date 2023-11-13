import axios, {AxiosInstance} from "axios";

class ComputerService {
    private readonly instance:AxiosInstance;

    constructor(url:string){
        this.instance = axios.create({
            baseURL: url,
            timeout: 30000,
            timeoutErrorMessage: "Time out!"
        })
    }

    sendFen = async(board: number[][], col: string, castle: string, passant: string, halfmoves: number, fullmoves: number) => {
        return this.instance.post('/', { board, col, castle, passant, halfmoves, fullmoves })
            .then(res => res.data)
            .catch(err => {
                console.log(err);
            });
    };
}
const computerService = new ComputerService("http://localhost:8000")
export default computerService