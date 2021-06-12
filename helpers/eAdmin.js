module.exports={
    eAdmin:(req,res,next)=>{
        if(req.isAuthenticated() && req.user.eAdmin===1){
            return next()
        }
        req.flash('error_msg','Você precisa ser um Admin')
        res.redirect('/')
    },
    Usu:(req,res,next)=>{
        if(req.isAuthenticated() && req.user.eAdmin===1){
            return next()
        }
        if(req.isAuthenticated() && req.user.eAdmin===0){
            return next()
        }
        req.flash('error_msg','Você precisa se logar')
        res.redirect('/')
    }
    
}

    