document.addEventListener("DOMContentLoaded", function(event) {
    new MainViewController();
});;/**
 * Created by Hedgehog on 22.05.18.
 */

function EditorViewController(mainController){
    let inputFields = document.getElementsByClassName("editor__formgroup");
    let currentNote = new Note();

    this.constructor = function(){
        //Event Listeners
        let self = this;
        document.getElementById("editor__closebutton").addEventListener('click', function (e) {
            self.show(false);
        });
        document.getElementById("editor__savebutton").addEventListener('click', function (e) {
            self.submit();
        });
        let editorImportanceIcons = document.getElementsByClassName("editor__listgroup__importanceselector_listitem");
        for (let icon of editorImportanceIcons) {
            let anchor = icon.getElementsByTagName("a")[0];
            anchor.addEventListener('mouseover', self.editorImportanceIconOver.bind(this));
            anchor.addEventListener('mouseout', self.editorImportanceIconOut.bind(this));
            anchor.addEventListener('click', self.editorImportanceIconClick.bind(this));
        }
    };

    let updateDate = function(n){
        document.querySelector(".editor__listgroup__dateselector_value").innerHTML = moment(n).format('ll');
    };
    this.show = function(state, elementId = null){
        function HideElementById(selector){
            document.getElementById(selector).style.display = "none";
        }
        function ShowElementById(selector){
            document.getElementById(selector).style.display = "block";
        }
        if(state){
            HideElementById("list-wrapper");
            ShowElementById("editor-wrapper");
            let currentNote = null;
            let self = this;
            if(elementId){
                mainController.notesStorage.getNoteById(elementId, function (note) {
                    currentNote = note;
                    self.setForm(currentNote);
                });
            } else {
                currentNote = new Note();
                currentNote.date = new Date().getTime();
                self.setForm(currentNote);
            }
        } else {
            ShowElementById("list-wrapper");
            HideElementById("editor-wrapper");
        }
    };

    this.submit = function(){
        let self = this;
        let form = document.forms.newNote;
        currentNote.title = form.title.value;
        currentNote.description = form.description.value;
        if(currentNote._id == null){
            mainController.notesStorage.addServerNote(currentNote, done);
        } else {
            mainController.notesStorage.updateServerNote(currentNote, done);
        }
        function done(){
            mainController.listView.update();
            self.show(false);
        }
    };
    this.setForm = function(n){
        let checkLabelClasses = function(label){
            if(label.value != "") label.forLabel.classList.add("editor__formgroup__label--small");
            else label.forLabel.classList.remove("editor__formgroup__label--small");
        };
        currentNote = n;
        let form = document.forms.newNote;
        form.title.value = n.title;
        checkLabelClasses(form.title);
        form.description.value = n.description;
        checkLabelClasses(form.description);

        updateDate(currentNote.date);
        updateImportanceIcons(currentNote.importance);
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
        let inputField = item.getElementsByClassName("editor__formgroup__input")[0];
        let labelField = item.getElementsByClassName("editor__formgroup__label")[0];
        if (inputField && labelField){
            inputField.forLabel = labelField;
            inputField.addEventListener('focus', this.onFocus.bind(this, labelField));
            inputField.addEventListener('blur', this.onBlur.bind(this, labelField));
        }
    }

    let importanceListItemTemplate = document.getElementById("editor_listgroup__importanceselector__template").innerHTML;
    Mustache.parse(importanceListItemTemplate);
    let importanceListItems = "";
    for(var i=0;i<5;i++){
        let icon ={
            index: i
        };
        importanceListItems += Mustache.render(importanceListItemTemplate,icon);
    }
    document.getElementById('editor__listgroup__importanceselector').innerHTML = importanceListItems;
    let editorImportanceIcons = document.getElementsByClassName("editor__listgroup__importanceselector__icon");
    let updateImportanceIcons = function(value = 1){
        for (let icon of editorImportanceIcons){
            if(icon.dataset.index < value) {
                icon.classList.add("editor__listgroup__importanceselector__icon--active");
            } else {
                icon.classList.remove("editor__listgroup__importanceselector__icon--active");
            }
        }
    };
    this.editorImportanceIconClick = function(e){
        currentNote.importance = parseInt(e.target.dataset.index) + 1;
        updateImportanceIcons(currentNote.importance);
    };
    this.editorImportanceIconOver = function(e){
        updateImportanceIcons(parseInt(e.target.dataset.index) + 1);
    };
    this.editorImportanceIconOut = function(e){
        updateImportanceIcons(currentNote.importance);
    };

    let picker = new MaterialDatetimePicker()
    .on('submit', function(val) {
        currentNote.date = val.valueOf();
        updateDate(currentNote.date);
    });
    document.querySelector('.editor__listgroup__dateselector_button').addEventListener('click', function(){
        picker.open();
    });
    this.constructor();
};/**
 * Created by Hedgehog on 16.05.18.
 */
function ListViewController(mainController){

    this.showDone = false;
    this.currentSort = "due";

    this.constructor = function(){
        //Event Listeners
        let self = this;
        document.getElementById("list__container").addEventListener('click', function (e) {
            let type = e.target.type;
            if(type == "submit") mainController.editorView.show(true, e.target.dataset.id);
            if(type == "checkbox") self.activate(e.target.dataset.id, e.target);
        });
        document.getElementById("list__fab").addEventListener('click', function (e) {
            mainController.editorView.show(true);
        });
        document.getElementById("nav__showdone").addEventListener('change', function(e){
            self.setActives(e.target.checked);
        });
        document.getElementById('list-wrapper').addEventListener('change', function (e) {
            if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
                self.currentSort = e.target.value;
                self.update();
            }
        });
        this.update();
    };

    this.update = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        let self = this;
        mainController.notesStorage.getNotes(this.currentSort, this.showDone, function (notes){
            self.populateData(notes);
        });

    };

    this.populateData = function(notes){
        var output = "";
        let template = null;
        if(notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let importanceIconTemplate = document.getElementById("list__item__importance__icon__template").innerHTML;

            Mustache.parse(template);
            Mustache.parse(importanceIconTemplate);

            notes.forEach(function(elem, index){
                // console.log(elem);
                let itemData = Object.assign({}, elem);
                itemData.dateFormatted = moment(elem.date).format('ll');
                itemData.theme = mainController.theme.currentTheme;
                itemData.importanceIcons = "";
                itemData._id = elem._id;
                itemData.checked = (elem.status === "DONE" ? true : false);
                for(var i=0;i<5;i++){
                    itemData.importanceIcons += Mustache.render(importanceIconTemplate, (i<itemData.importance ? {active: true} : {active: false}));
                }
                output += Mustache.render(template, itemData);
            });
        } else {
            template = document.getElementById("list__nodata__template").innerHTML;
            output = Mustache.render(template);
        }

        document.getElementById('list__container').innerHTML = output;

        let overlays = document.getElementsByClassName('list__item__overlay');
        [...overlays].forEach(function(elem) {
            elem.style.display = "none";
        });
    };
    this.activate = function(id, checkbox){
        let elem = document.getElementById("list__item__id__"+id);
        elem.style.height = (elem.clientHeight-30)+"px";
        elem.querySelector('.list__item__overlay').style.display = "flex";
        let self = this;
        mainController.notesStorage.getNoteById(id, function (note) {
            note.status = checkbox.checked ? "DONE" : "UNDONE";
            mainController.notesStorage.updateServerNote(note, function (){
                if(!self.showDone){
                    elem.classList.add("list__item--fadeout");
                    elem.style.height = "0px";
                }
                else self.update();
            });
        });

    };
    this.setActives = function(checked){
        this.showDone = checked;
        this.update();
    };
    this.constructor();
}
;/**
 * Created by Hedgehog on 05.06.18.
 */
function MainViewController(){
    this.notesStorage = new NotesStorage();
    this.theme = new Theme();

    this.listView = new ListViewController(this);
    this.editorView = new EditorViewController(this);

    this.constructor = function(){
        moment.locale(document.documentElement.lang);
        this.editorView.show(false);

        let self = this;
        document.getElementById("nav__themeselector").addEventListener('change', function (e) {
            self.theme.onChange(e.target.value);
        });
    };
    this.constructor();
};/**
 * Created by Hedgehog on 16.05.18.
 */
function Note(){
    this._id = null;
    this.title = "";
    this.description = "";
    this.date = null;
    this.created = new Date().getTime();
    this.importance = 1;
    this.status = "UNDONE";

    this.update = function(data){
        if(data._id) this._id = data._id;
        if(data.title) this.title = data.title;
        if(data.description) this.description = data.description;
        if(data.date) this.date = parseInt(moment(data.date).format("x"));
        if(data.created) this.created = parseInt(moment(data.created).format("x"));
        if(data.importance) this.importance = data.importance;
        if(data.status) this.status = data.status;
    };
};/**
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
        fetch('/notes?showAll='+String(showActive)).then(function(response){
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

};/**
 * Created by Hedgehog on 16.05.18.
 */
function Theme(mainController){
    this.styleThemeKey = "remindeerTheme";
    this.currentTheme = "default";
    this.onChange = function(newTheme){
        this.redraw(newTheme);
    };
    this.redraw = function(newTheme = null){
        let oldTheme = this.currentTheme;
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