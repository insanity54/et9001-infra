var bodyParser = require('body-parser');


var api = function api(red, app) {

    
    // // parse application/x-www-form-urlencoded
    //app.use(bodyParser.urlencoded({ extended: false }));
    
    // parse application/json
    app.use(bodyParser.json());
    
    
    
    /**
     * util functions
     */
     
    var isValidId = function isValidId(id) {
        return /^[0-9]{1,6}$/.test(id);
    };
    
    
    
    /**
     * middleware
     */
     
     
     
     
    var setup = function setup(req, res, next) {
        if (typeof req._infra === 'undefined') req._infra = {};
        return next();
    };
    
    
    var getReqParams = function getReqParams(req, res, next) {
        if (typeof req.params.pid !== 'undefined' && isValidId(req.params.pid))
            req._infra.pid = req.params.pid;
    
        if (typeof req.params.cid !== 'undefined' && isValidId(req.params.cid))
            req._infra.cid = req.params.cid;
        
        return next();
    };
    
    
    var getPage = function getPage(req, res, next) {
        if (req._infra.cid) {
            red.lrange('infra:page:'+req._infra.pid, req._infra.cid, (req._infra.cid+1), function(err, reply) {
                if (err) throw err;
                // if reply is empty array or no reply at all
                if (reply.length < 1 || !reply)
                    return res.json({});
                return res.json(reply);
            });
        }

        // page requested without conference ID        
        else {
            red.lrange('infra:page:'+req._infra.pid, 0, -1, function(err, reply) {
                if (err) throw err;
                if (!reply) return res.json([]);
                return res.json(reply);
            });
        }
    };
    
    var logRequest = function logRequest(req, res, next) {
        var pid, cid, ua;
        pid = req.params.pid || '';
        cid = req.params.cid || '';
        ua = req.headers['user-agent'],
        console.log('req '+ua+' pid='+pid+' cid='+cid);
        next();
    };
    
    app.get('/',
        setup,
        logRequest,
        function(req, res) {
           res.json({'root': 'yes'}); 
        });
    
    app.get('/api/conferences/:pid/:cid',
        setup,
        logRequest,
        getReqParams,
        getPage
    );
    
    app.get('/api/conferences/:pid',
        setup,
        logRequest,
        getReqParams,
        getPage
    );
        
};



module.exports = api;