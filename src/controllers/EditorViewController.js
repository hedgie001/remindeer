/**
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
                self.currentNote.date = val.valueOf();
                self.updateDate();
            });
        document.querySelector('.editor__listgroup__dateselector_button').addEventListener('click', function(){
            picker.open();
        });

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
    this.updateDate = function(){
        document.querySelector(".editor__listgroup__dateselector_value").innerHTML = moment(this.currentNote.date).format('ll');
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
}