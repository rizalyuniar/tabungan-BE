const validate =(req, res, next)=>{
    const {  } = req.body
    try {
        
    } catch (error) {
        return res.send(`${error}`)
    }
    next()
}

// const myCors = (req,res,next)=>{
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//     response.setHeader('Access-Control-Headers', 'Content-Type');
//   }
module.exports = {validate}