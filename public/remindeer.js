var mainController = new MainController();

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("init");
    moment.locale(document.documentElement.lang);
    mainController.init("due");
});
document.getElementById('list-wrapper').onchange = function(e) {
    //Watching for cahnges in sort list
    if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
        mainController.init(e.target.value);
    }
};

//HELPERS
function HideElementById(selector){
    document.getElementById(selector).style.display = "none";
}
function ShowElementById(selector){
    document.getElementById(selector).style.display = "block";
}

;/**
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
};/**
 * Created by Hedgehog on 22.05.18.
 */

function EditorController(mainController){
    this.currentNote = null;
    this.show = function(state, elementId = null){
        if(state){
            HideElementById("list-wrapper");
            ShowElementById("editor-wrapper");
            let note = new Note();
            if(elementId){
                note = this.getNoteById(elementId);
            } else {
                note = new Note();
            }
            this.setForm(note);
        } else {
            ShowElementById("list-wrapper");
            HideElementById("editor-wrapper");
        }
    };

    this.getNoteById = function(id){
        let note = new Note();
        mainController.data.notes.forEach(function(elem, index){
            if(elem.id == id) {
                note.update(elem);
            }
        });
        return note;
    };
    this.submit = function(){
        let form = document.forms.newNote;
        //TODO Validate
        let n = {
            "title": form.title.value,
            "description": form.description.value,
            "date": moment(form.date.value).valueOf(),
            "importance": form.importance.value
        };
        this.currentNote.update(n);
        mainController.data.saveLocalNote(this.currentNote);
        mainController.init("due");
        this.show(false);
    };
    this.setForm = function(note){
        let form = document.forms.newNote;
        form.title.value = note.title;
        form.description.value = note.description;
        form.date.value = moment(note.date).format("YYYY-MM-DD");
        form.importance.value = note.importance;

        this.currentNote = note;
    };
    this.show(false);
};/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){
    this.data = new DataController(this);
    this.editor = new EditorController(this);

    this.init = function(sortBy){
        if(sortBy){
            document.getElementById("sort-"+sortBy).checked = true;
        }
        this.data.getNotes(sortBy);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";

        if(this.data.notes.length > 0){
            let template = document.getElementById("list__item__template").innerHTML;
            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                output += Mustache.render(template, elem);
            });
        } else {
            output = Mustache.render(document.getElementById("list__nodata__template").innerHTML);
        }
        document.getElementById('list__container').innerHTML = output;
    };
}
;/**
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
};/**
 * Created by Hedgehog on 16.05.18.
 */
function ThemeController(){
    console.log("Theme Controller");
}