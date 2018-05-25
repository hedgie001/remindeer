document.addEventListener("DOMContentLoaded", function(event) {

    moment.locale(document.documentElement.lang);

    let mainController = new MainController();

    //Event Listeners
    let list = document.getElementById("list__container");
    list.addEventListener('click', function (e) {
        let type = e.target.type;
        if(type == "submit") mainController.editor.show(true, e.target.dataset.id);
        if(type == "checkbox") mainController.activate(e.target.dataset.id, e.target);
    });
    let listCreate = document.getElementById("list__fab");
    listCreate.addEventListener('click', function (e) {
        mainController.editor.show(true);
    });
    let editorCreate = document.getElementById("editor__closebutton");
    editorCreate.addEventListener('click', function (e) {
        mainController.editor.show(false);
    });
    let editorClose = document.getElementById("editor__savebutton");
    editorClose.addEventListener('click', function (e) {
        mainController.editor.submit();
    });
    let themeSelector = document.getElementById("nav__themeselector");
    themeSelector.addEventListener('change', function (e) {
        mainController.theme.onChange(e.target.value);
    });
    let showDone = document.getElementById("nav__showdone");
    showDone.addEventListener('change', function(e){
        mainController.setActives(e.target.checked);
    });
    let listChange = document.getElementById('list-wrapper');
    listChange.addEventListener('change', function (e) {
        if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
            mainController.currentSort = e.target.value;
            mainController.init();
        }
    });
    mainController.init();
});

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
    let inputFields = document.getElementsByClassName("editor__formgroup");
    this.show = function(state, elementId = null){
        if(state){
            HideElementById("list-wrapper");
            ShowElementById("editor-wrapper");
            let note = new Note();
            if(elementId){
                note = mainController.data.getNoteById(elementId);
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
        let checkLabel = function(label){
            if(label.value != "") label.forLabel.classList.add("editor__formgroup__label--small");
            else label.forLabel.classList.remove("editor__formgroup__label--small");
        };
        let form = document.forms.newNote;
        form.title.value = note.title;
        checkLabel(form.title);
        form.description.value = note.description;
        checkLabel(form.description);
        form.date.value = moment(note.date).format("YYYY-MM-DD");
        form.importance.value = note.importance;


        this.currentNote = note;

    };

    this.onFocus = function(label){
        label.classList.add("editor__formgroup__label--small");
        label.classList.add("editor__formgroup__label--animate");
    };
    this.onBlur = function(label, event){
        if(event.target.value == ""){
            label.classList.remove("editor__formgroup__label--small");
        }
    };
    for (let item of inputFields) {
        let inputField = item.getElementsByTagName("input")[0];
        let labelField = item.getElementsByTagName("label")[0];
        if (inputField && labelField){
            inputField.forLabel = labelField;
            inputField.addEventListener('focus', this.onFocus.bind(this, labelField));
            inputField.addEventListener('blur', this.onBlur.bind(this, labelField));
        }
    }
};/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){
    this.data = new DataController(this);
    this.editor = new EditorController(this);
    this.editor.show(false);
    this.theme = new ThemeController(this);

    this.showDone = false;
    this.currentSort = "due";

    this.init = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        this.data.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(this.data.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let theme = this.theme.currentTheme;

            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                elem.theme = theme;
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
        let note = this.data.getNoteById(id);
        note.active = checkbox.checked;
        this.data.saveLocalNote(note);
        /*setTimeout(function(){
            alert("delay");
        }, 2500);*/
        this.init();
    };
    this.setActives = function(checked){
        this.showDone = checked;
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
    this.styleThemeKey = "remindeerTheme";
    this.currentTheme = "default";
    this.onChange = function(newTheme){
        this.redraw(newTheme);
    };
    this.redraw = function(newTheme = null){
        let oldTheme = this.currentTheme;
        console.log("redraw", oldTheme, newTheme);
        let changeClassTheme = function(classContent){
            return classContent.replace("--"+oldTheme, "--"+newTheme);
        };
        let allNodes = document.querySelectorAll('*');
        allNodes.forEach(function(node) {
            let classContent = node.getAttribute("class");
            if(classContent){
                node.setAttribute("class", changeClassTheme(classContent));
            }
        });
        this.currentTheme = newTheme;
        localStorage.setItem(this.styleThemeKey, this.currentTheme);
        document.getElementById("nav__themeselector").value = this.currentTheme;
    };
    let localTheme = localStorage.getItem(this.styleThemeKey);
    if (localTheme) this.redraw(localTheme);
}