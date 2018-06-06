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
            if(elementId){
                currentNote = mainController.notesStorage.getNoteById(elementId);
            } else {
                currentNote = new Note();
                currentNote.date = new Date().getTime();
            }
            this.setForm(currentNote);
        } else {
            ShowElementById("list-wrapper");
            HideElementById("editor-wrapper");
        }
    };

    this.submit = function(){
        let form = document.forms.newNote;
        currentNote.title = form.title.value;
        currentNote.description = form.description.value;
        if(currentNote.id == null){
            mainController.notesStorage.addLocalNote(currentNote);
        } else {
            mainController.notesStorage.updateLocalNote(currentNote);
        }
        mainController.listView.update();
        this.show(false);
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
        this.populateData(mainController.notesStorage.getNotes(this.currentSort, this.showDone));
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
                let itemData = Object.assign({}, elem);
                itemData.dateFormatted = moment(elem.date).format('ll');
                itemData.theme = mainController.theme.currentTheme;
                itemData.importanceIcons = "";
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
    };
    this.activate = function(id, checkbox){
        let self = this;
        let note = mainController.notesStorage.getNoteById(id);
        note.active = checkbox.checked;
        mainController.notesStorage.updateLocalNote(note);
        setTimeout(function(){
            self.update();
        }, 2500);
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
    this.id = null;
    this.title = "";
    this.description = "";
    this.date = null;
    this.created = new Date().getTime();
    this.importance = 1;
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