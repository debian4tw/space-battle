
module.exports = function(){
	//console.log(process.argv[2]);
    var port;
    var baseURl;
    var jsUrl;

    switch(process.argv[2]){

        case 'dev':
            port = 3000,
        	baseUrl = 'http://localhost:3000', 
        	jsUrl = 'http://localhost:3000/javascripts'
      	break;


        case 'qa':
            port = 3000,
            baseUrl = 'http://192.168.1.102:3000/', 
            jsUrl = 'http://192.168.1.102:3000/javascripts'

        break;

		default:
            port = 10834,
            baseUrl = 'http://108.59.6.220:10834',
            jsUrl = 'http://108.59.6.220:10834/javascripts'
        break;
    }


    return{
        port: port,
        baseUrl: baseUrl,
        jsUrl: jsUrl
    }
}();