/**
 * Created by Hedgehog on 17.05.18.
 */
function NotesStorage(mainController){
    this.localStorageKey = "remindeer";
    this.notes = [];

    this.getNotes = function(sort = null, showActive = false){
        //get data
        let data = this.getLocalNotes(showActive);

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
        let note = null;
        this.notes.forEach(function(elem, index){
            if(elem.id == id) {
                note = elem;
            }
        });
        return note;
    };
    this.getLocalNotes = function(showActive = false){
        let data = localStorage.getItem(this.localStorageKey);
        if(data == null){
            data = {
                "api": "1.0.0",
                "notes": []
            };
        } else {
            data = JSON.parse(data);
            let allNotes = [];
            data.notes.forEach(function(elem, index){
                let n = new Note();
                n.update(elem);
                if(showActive) allNotes.push(n);
                else {
                    if(n.active == false) allNotes.push(n);
                }
            });
            data.notes = allNotes;
        }
        return data;
    };
    this.updateLocalNote = function(note){
        let data = this.getLocalNotes(true);
        data.notes.forEach(function(elem, index){
            if(elem.id == note.id){
                data.notes[index] = note;
            }
        });
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
        return data;
    };
    this.addLocalNote = function(note){
        let data = this.getLocalNotes(true);
        note.id = data.notes.length+1;
        data.notes.push(note);
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
        return data;
    };
}