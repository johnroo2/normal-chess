export default function repetition(arrays:number[][]){
    const occurrences = new Map<string, number>();
    for (let i = 0; i < arrays.length; i++) {
      const arrString = arrays[i].toString();
      if([...occurrences.keys()].includes(arrString)){
        occurrences.set(arrString, occurrences.get(arrString) as number + 1)
      }
      else{
        occurrences.set(arrString, 1)
      }
    }
  
    for (let val of [...occurrences.values()]) {
        if (val >= 3) {
            return true
        }
    }
    return false
}