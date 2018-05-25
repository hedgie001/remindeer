/**
 * Created by Hedgehog on 22.05.18.
 */

function EditorController(mainController){
    let inputFields = document.getElementsByClassName("editor__formgroup");
    let note = null;
    this.show = function(state, elementId = null){
        if(state){
            HideElementById("list-wrapper");
            ShowElementById("editor-wrapper");
            let currentNote = null;
            if(elementId){
                currentNote = mainController.data.getNoteById(elementId);
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
        //TODO Validate
        let n = {
            "title": form.title.value,
            "description": form.description.value,
            "date": moment(form.date.value).valueOf(),
            "importance": note.importance
        };
        note.update(n);
        mainController.data.saveLocalNote(note);
        mainController.init();
        this.show(false);
    };
    this.setForm = function(n){
        let checkLabelClasses = function(label){
            if(label.value != "") label.forLabel.classList.add("editor__formgroup__label--small");
            else label.forLabel.classList.remove("editor__formgroup__label--small");
        };
        let form = document.forms.newNote;
        form.title.value = n.title;
        checkLabelClasses(form.title);
        form.description.value = n.description;
        checkLabelClasses(form.description);
        form.date.value = moment(n.date).format("YYYY-MM-DD");

        note = n;
        updateImportanceIcons();

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
    let updateImportanceIcons = function(value = null){
        if (value == null) value = note.importance;
        for (let icon of editorImportanceIcons){
            if(icon.dataset.index < value) {
                icon.classList.add("editor__listgroup__importanceselector__icon--active");
            } else {
                icon.classList.remove("editor__listgroup__importanceselector__icon--active");
            }
        }
    };
    this.editorImportanceIconClick = function(e){
        note.importance = parseInt(e.target.dataset.index) + 1;
        updateImportanceIcons();
    };
    this.editorImportanceIconOver = function(e){
        updateImportanceIcons(parseInt(e.target.dataset.index) + 1);
    };
    this.editorImportanceIconOut = function(e){
        updateImportanceIcons();
    };


}