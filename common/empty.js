exports.isEmpty = function(req, res) {
    console.log(req);
    for(var key in req) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}