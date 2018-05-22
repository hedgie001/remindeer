/**
 * Created by Hedgehog on 17.05.18.
 */
function DataController(mainController){
    this.localStorageKey = "remindeer";
    this.notes = [];

    this.getNotes = function(sort = null){
        //get data
        let data = this.getLocalData();

        //Check API Version, etc...

        // sort
        switch(sort) {
            case "due": //by due
                data.notes.sort(((a,b) => a.date - b.date));
                break;
            case "created": //by created
                data.notes.sort(((a,b) => b.created - a.created));
                break;
            case "importance": //by importance
                data.notes.sort(((a,b) => b.importance - a.importance));
                break;
            default:

        }
        this.notes = data.notes;
        return this.notes;
    };

    this.getLocalData = function(){
        let data = localStorage.getItem(this.localStorageKey);
        if(data == null){
            data = {
                "api": "1.0.0",
                "empty" : true,
                "notes": []
            };
        } else {
            data  = JSON.parse(data);
        }
        return data;
    };
    this.saveLocalNote = function(note){
        console.log(note);
        let data = this.getLocalData();
        if(note.id){
            //Update
            console.log("CHECK FOR UPDATE", note.id);
            data.notes.forEach(function(elem, index){
                if(elem.id == note.id){
                    console.log("Update found", note);
                    data.notes[index] = note;
                    console.log("Update found 2", data);
                }
            });
        } else {
            //Create
            note.id = data.notes.length+1;
            data.notes.push(note);
        }
        data.empty = false;
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
        return data;
    };
}