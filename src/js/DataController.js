/**
 * Created by Hedgehog on 17.05.18.
 */
function DataController(mainController){
    this.localStorageKey = "remindeer";
    this.notes = [];

    this.getNotes = function(sort = null, showActive = false){
        //get data
        let data = this.getLocalData(showActive);

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

    this.getNoteById = function(id){
        let note = new Note();
        this.notes.forEach(function(elem, index){
            if(elem.id == id) {
                note.update(elem);
            }
        });
        return note;
    };

    this.getLocalData = function(showActive = false){
        let data = localStorage.getItem(this.localStorageKey);
        if(data == null){
            data = {
                "api": "1.0.0",
                "notes": []
            };
        } else {
            data  = JSON.parse(data);
            if(!showActive){
                let actives = [];
                data.notes.forEach(function(elem, index){
                    if(elem.active == false) {
                        actives.push(elem);
                    }
                });
                data.notes = actives;
            }
        }
        return data;
    };
    this.saveLocalNote = function(note){
        let data = this.getLocalData(true);
        if(note.id){
            //Update
            data.notes.forEach(function(elem, index){
                if(elem.id == note.id){
                    data.notes[index] = note;
                }
            });
        } else {
            //Create
            note.id = data.notes.length+1;
            data.notes.push(note);
        }
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
        return data;
    };
}