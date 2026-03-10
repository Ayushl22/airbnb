module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);  // if error aaya toh next call ho
    }
}