var http = require('http');
var url = require('url');
var request = require('request');
var jsons=function(a){
	try{return JSON.parse(a)}catch(e){return {}}
}
var send=function(res,obj){
	res.end(JSON.stringify(obj));
}

http.createServer(function(req,res){
	let obj={status:404};
	res.writeHead(200,{'Content-Type': 'application/json; charset=UTF-8'});
	if (req.method=='POST') {
		var body = ''
		req.on('data',(data)=>{
			body+=data
		}).on('end', ()=>{
			var q=url.parse('?'+body,1).query;
			if(typeof q.code=='string'){
				obj.status=400;
				let op=jsons(q.code);
				if(op.hasOwnProperty('url')){
					request(op,(error,response,body)=>{
						obj.status=500;
						if(error==null){
							obj.status=200;
							obj.data={
								status:response.statusCode,
								head:response.headers,
								body:body,
							};

							if(typeof q.add=='string'){
								let add=jsons(q.add);
								obj.db={};
								for(let x in add)obj.db[x]=add[x]
							}
							if(typeof q.run=='string')obj.root={script:q.run};
							send(res,obj);
						}else send(res,obj);
					})
				}else send(res,obj);
			}else send(res,obj);
		})
	}else send(res,obj);
}).listen(process.env.PORT||3000,process.env.HOST||'0.0.0.0');
