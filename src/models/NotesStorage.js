/**
 * Created by Hedgehog on 17.05.18.
 */
function NotesStorage(mainController){
    this.getNotes = function(sort = null, showActive = false, callback = function(){}){
        let notes = [];
        fetch('/notes?showAll='+String(showActive)).then(function(response){
            return response.json();
        }).then(function(newNotes){
            newNotes.forEach(function(elem, index){
                let newNote = new Note();
                newNote.update(elem);
                notes.push(newNote);
            });
            switch(sort) {
                case "due": //by due
                    notes.sort(function(a,b) {return a.date - b.date;});
                    break;
                case "created": //by created
                    notes.sort(function(a,b) {return b.created - a.created;});
                    break;
                case "importance": //by importance
                    notes.sort(function(a,b) {return b.importance - a.importance;});
                    break;
                default:
            }
            callback(notes);
        });
    };
    this.addNote = function(note, callback){
        fetch('/notes', {method: "post", body: JSON.stringify(note),headers: {
                'content-type': 'application/json'
            }}).then(function(response){
            callback();
        });
    };
    this.updateNote = function( note, callback){
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
}