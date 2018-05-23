var mainController = new MainController();

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("init");
    moment.locale(document.documentElement.lang);
    mainController.init("due");
});
document.getElementById('list-wrapper').onchange = function(e) {
    //Watching for cahnges in sort list
    if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
        mainController.currentSort = e.target.value;
        mainController.init();
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

    this.getLocalData = function(showActive = false){
        let data = localStorage.getItem(this.localStorageKey);
        if(data == null){
            data = {
                "api": "1.0.0",
                "empty" : true,
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
                note = mainController.getNoteById(elementId);
            } else {
                note = new Note();
            }
            this.setForm(note);
        } else {
            ShowElementById("list-wrapper");
            HideElementById("editor-wrapper");
        }
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
        mainController.init();
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
    this.theme = new ThemeController(this);

    this.showDone = false;
    this.currentSort = "due";

    this.init = function(){
        document.getElementById("sort-"+this.currentSort).checked = true;

        this.data.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(this.data.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                for(var i=0;i<5;i++){
                    elem.importanceIcons += "<i class=\"list__item__importance__icon "+(i<elem.importance ? "list__item__importance__icon--active" : "")+"\">•</i>";
                }
                output += Mustache.render(template, elem);
            });
        } else {
            template = document.getElementById("list__nodata__template").innerHTML;
            output = Mustache.render(template);
        }
        document.getElementById('list__container').innerHTML = output;
    };
    this.activate = function(id, checkbox){
        let note = this.getNoteById(id);
        note.active = checkbox.checked;
        this.data.saveLocalNote(note);
        /*setTimeout(function(){
            alert("delay");
        }, 2500);*/
        this.init();
    };
    this.getNoteById = function(id){
        let note = new Note();
        this.data.notes.forEach(function(elem, index){
            if(elem.id == id) {
                note.update(elem);
            }
        });
        return note;
    };
    this.setActives = function(checkbox){
        this.showDone = checkbox.checked;
        this.init();
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
function ThemeController(mainController){
    console.log("Theme Controller");
}