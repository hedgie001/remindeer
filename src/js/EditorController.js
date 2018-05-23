/**
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
}