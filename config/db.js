if(process.env.NODE_ENV=='production'){
    module.exports={
        mongoURI:'mongodb+srv://diogo1401:alba1401@cluster0.xf6c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    }
}else{
    module.exports={
        mongoURI:'mongodb://localhost/blogoapp'
    }
}