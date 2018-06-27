/**
 * Created by Hedgehog on 16.05.18.
 */
function Note(){
    this._id = null;
    this.title = "";
    this.description = "";
    this.date = null;
    this.created = new Date().getTime();
    this.importance = 1;
    this.status = "OK";

    this.update = function(data){
        if(data._id) this._id = data._id;
        if(data.title) this.title = data.title;
        if(data.description) this.description = data.description;
        if(data.date) this.date = parseInt(moment(data.date).format("x"));
        if(data.created) this.created = parseInt(moment(data.created).format("x"));
        if(data.importance) this.importance = data.importance;
        if(data.status) this.status = data.status;
    };
}