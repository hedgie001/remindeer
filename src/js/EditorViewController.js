/**
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
        mainController.init();
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
}