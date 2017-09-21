var bodyParser = require("body-parser");

var data = [{item: 'ex 01'}, {item: 'ex 02'}];

var urlencodedParser = bodyParser.urlencoded({ extended: false })


module.exports = function(app){

    app.get('/todo', function(req, res){
        res.render('todo', {todos: data})
    })
    app.post('/todo', urlencodedParser, function(req, res){
        data.push(req.body)
        res.sendStatus(200)
        //res.json({ access: 'logged' });
    })

    app.delete('/todo', urlencodedParser, function(req, res){
        var i=0;
        data.forEach(function(entry) {
            console.log(entry)
            if(entry.item==req.body.item){
                data.splice(i, 1)
            }
            i++;
        });
        res.sendStatus(200)
    })
}