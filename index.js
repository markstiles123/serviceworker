let express=require('express'),
fs=require('fs')

let names=fs.readdirSync(__dirname+'/public/markdown')
app=express()
app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=>{
    res.set('Cache-Control','no-store')
    res.sendFile(__dirname+'/views/index.html')
})
app.get('/md',(req,res)=>{
    res.json({files:names})
})
app.listen(8000,_=>console.log('server running'))