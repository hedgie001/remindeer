/**
 * Created by Hedgehog on 17.05.18.
 */
function NotesStorage(mainController){
    this.localStorageKey = "remindeer";
    this.notes = [];

    this.getNotes = function(sort = null, showActive = false, callback = function(){}){
        this.getServerNotes(showActive, function(notes){
            switch(sort) {
                case "due": //by due
                    notes.sort(((a,b) => a.date - b.date));
                    break;
                case "created": //by created
                    notes.sort(((a,b) => b.created - a.created));
                    break;
                case "importance": //by importance
                    notes.sort(((a,b) => b.importance - a.importance));
                    break;
                default:
            }
            this.notes = notes;
            callback(this.notes);
        });
    };

    this.getServerNotes = function(showActive, callback){
        let notes = [];
        fetch('/notes').then(function(response){
            return response.json();
        }).then(function(newNotes){
            newNotes.forEach(function(elem, index){
                let n = new Note();
                n.update(elem);
                notes.push(n);
            });
            callback(notes);
        });
    };
    this.addServerNote = function(note, callback){
        fetch('/notes', {method: "post", body: JSON.stringify(note),headers: {
                'content-type': 'application/json'
            }}).then(function(response){
            callback();
        });
    };
    this.updateServerNote = function( note, callback){
        fetch('/notes/'+note._id, {method: "post", body: JSON.stringify(note),headers: {
                'content-type': 'application/json'
            }}).then(function(response){
            callback();
        });
    };

    this.getNoteById = function(id, callback){
        fetch('/notes/'+id).then(function(response){
            return response.json();
        }).then(function(data){
            let note = new Note();
            note.update(data);
            callback(note);
        });
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