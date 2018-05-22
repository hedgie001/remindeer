/**
 * Created by Hedgehog on 16.05.18.
 */
function Note(){
    this.id = null;
    this.title = "";
    this.description = "";
    this.date = null;
    this.created = new Date().getTime();
    this.importance = null;
    this.active = false;

    this.update = function(data){
        if(data.id) this.id = data.id;
        if(data.title) this.title = data.title;
        if(data.description) this.description = data.description;
        if(data.date) this.date = data.date;
        if(data.created) this.created = data.created;
        if(data.importance) this.importance = data.importance;
        if(data.active) this.active = data.active;
    };
}