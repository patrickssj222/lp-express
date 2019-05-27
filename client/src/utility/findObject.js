const findObject = (array, key, value)=>{
    let result = [];
    array.map((element)=>{
        if(element[key] === value){
            result.push(element);
        }
    });
    return result;
};
export default findObject;