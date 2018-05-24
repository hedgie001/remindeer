/**
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
}