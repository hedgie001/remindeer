document.addEventListener("DOMContentLoaded", function(event) {
    new MainViewController();
});;/**
 * Created by Hedgehog on 22.05.18.
 */

function EditorViewController(mainController){
    this.currentNote = new Note();

    this.constructor = function(){
        //Event Listeners
        let self = this;
        document.getElementById("editor__closebutton").addEventListener('click', function (e) {
            self.show(false);
        }); //Click on Close
        document.getElementById("editor__savebutton").addEventListener('click', function (e) {
            self.submit();
        }); //Click on Save


        let inputFields = document.getElementsByClassName("editor__formgroup");
        for (let item of inputFields) {
            let inputField = item.getElementsByClassName("editor__formgroup__input")[0];
            let labelField = item.getElementsByClassName("editor__formgroup__label")[0];
            if (inputField && labelField){
                inputField.forLabel = labelField;
                inputField.addEventListener('focus', this.onFocus.bind(this, labelField));
                inputField.addEventListener('blur', this.onBlur.bind(this, labelField));
            }
        } // Focus and Blur events for Input Fields

        let importanceListItemTemplate = document.getElementById("editor_listgroup__importanceselector__template").innerHTML;
        Mustache.parse(importanceListItemTemplate);
        let importanceListItems = "";
        for(let i=0;i<5;i++){
            let icon ={
                index: i
            };
            importanceListItems += Mustache.render(importanceListItemTemplate,icon);
        }
        document.getElementById('editor__listgroup__importanceselector').innerHTML = importanceListItems;

        let editorImportanceIcons = document.getElementsByClassName("editor__listgroup__importanceselector_listitem");
        for (let icon of editorImportanceIcons) {
            let anchor = icon.getElementsByTagName("a")[0];
            anchor.addEventListener('mouseover', self.editorImportanceIconOver.bind(this));
            anchor.addEventListener('mouseout', self.editorImportanceIconOut.bind(this));
            anchor.addEventListener('click', self.editorImportanceIconClick.bind(this));
        } //Click and Hover Importance Buttons

        let picker = new MaterialDatetimePicker()
            .on('submit', function(val) {
                this.currentNote.date = val.valueOf();
                this.updateDate();
            });
        document.querySelector('.editor__listgroup__dateselector_button').addEventListener('click', function(){
            picker.open();
        });

    };

    this.updateDate = function(){
        document.querySelector(".editor__listgroup__dateselector_value").innerHTML = moment(this.currentNote.date).format('ll');
    };

    this.show = function(state, noteID = null){
        function HideElementById(selector){
            document.getElementById(selector).style.display = "none";
        }
        function ShowElementById(selector){
            document.getElementById(selector).style.display = "block";
        }
        if(state){
            HideElementById("list-wrapper");
            ShowElementById("editor-wrapper");
            let self = this;
            if(noteID){
                mainController.notesStorage.getNoteById(noteID, function (note) {
                    self.setForm(note);
                });
            } else {
                let newNote = new Note();
                newNote.date = new Date().getTime();
                self.setForm(newNote);
            }
        } else {
            ShowElementById("list-wrapper");
            HideElementById("editor-wrapper");
        }
    };

    this.submit = function(){
        let self = this;
        let form = document.forms.newNote;
        let note = this.currentNote;
        note.title = form.title.value;
        note.description = form.description.value;
        if(note._id == null){
            mainController.notesStorage.addNote(note, done);
        } else {
            mainController.notesStorage.updateNote(note, done);
        }
        function done(){
            mainController.listView.update();
            self.show(false);
        }
    };
    this.setForm = function(note){
        let checkLabelClasses = function(label){
            if(label.value != "") label.forLabel.classList.add("editor__formgroup__label--small");
            else label.forLabel.classList.remove("editor__formgroup__label--small");
        };
        this.currentNote = note;
        let form = document.forms.newNote;
        form.title.value = note.title;
        checkLabelClasses(form.title);
        form.description.value = note.description;
        checkLabelClasses(form.description);

        this.updateDate();
        this.updateImportanceIcons();
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

    this.updateImportanceIcons = function(){
        let editorImportanceIcons = document.getElementsByClassName("editor__listgroup__importanceselector__icon");
        for (let icon of editorImportanceIcons){
            if(icon.dataset.index < this.currentNote.importance) {
                icon.classList.add("editor__listgroup__importanceselector__icon--active");
            } else {
                icon.classList.remove("editor__listgroup__importanceselector__icon--active");
            }
        }
    };
    this.editorImportanceIconClick = function(e){
        this.currentNote.importance = parseInt(e.target.dataset.index) + 1;
        this.updateImportanceIcons();
    };
    this.editorImportanceIconOver = function(e){
        this.currentNote.importance = parseInt(e.target.dataset.index) + 1;
        this.updateImportanceIcons();
    };
    this.editorImportanceIconOut = function(e){
        this.updateImportanceIcons();
    };
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
            if(type == "submit") mainController.editorView.show(true, e.target.dataset.id); //Click on Edit Button
            if(type == "checkbox") self.activate(e.target.dataset.id, e.target); //Click on Checkbox
        });
        document.getElementById("list__fab").addEventListener('click', function (e) {
            mainController.editorView.show(true); //Click on Floating Action Button
        });
        document.getElementById("nav__showdone").addEventListener('change', function(e){
            self.setActives(e.target.checked); //Click on ShowDone Button
        });
        document.getElementById('list-wrapper').addEventListener('change', function (e) {
            if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
                self.currentSort = e.target.value;
                self.update();
            }
        }); //Click on Sort Radio Buttons
        this.update();
    };

    this.update = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        let self = this;
        mainController.notesStorage.getNotes(this.currentSort, this.showDone, function (notes){
           self.renderList(notes);
        });
    };

    this.renderList = function(notes){
        let output = "";
        let template = null;
        if(notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let importanceIconTemplate = document.getElementById("list__item__importance__icon__template").innerHTML;

            Mustache.parse(template);
            Mustache.parse(importanceIconTemplate);

            notes.forEach(function(note, index){
                let itemTemplateData = Object.assign({}, note);
                itemTemplateData.dateFormatted = moment(note.date).format('ll');
                itemTemplateData.theme = mainController.theme.currentTheme;
                itemTemplateData.importanceIcons = "";
                itemTemplateData._id = note._id;
                itemTemplateData.checked = (note.status === "DONE" ? true : false);
                for(var i=0;i<5;i++){
                    itemTemplateData.importanceIcons += Mustache.render(importanceIconTemplate, (i<itemTemplateData.importance ? {active: true} : {active: false}));
                }
                output += Mustache.render(template, itemTemplateData);
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
            mainController.notesStorage.updateNote(note, function (){
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

        /* Event Listener */
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
        if(data._id) this._id = String(data._id);
        if(data.title) this.title = String(data.title);
        if(data.description) this.description = String(data.description);
        if(data.date) this.date = parseInt(moment(data.date).format("x"));
        if(data.created) this.created = parseInt(moment(data.created).format("x"));
        if(data.importance) this.importance = parseInt(data.importance);
        if(data.status) this.status = data.status;
    };
};/**
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
        document.querySelectorAll('*').forEach(function(node) {
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