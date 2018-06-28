/**
 * Created by Hedgehog on 05.06.18.
 */
function MainViewController(){
    this.notesStorage = new NotesStorage();
    this.theme = new Theme();

    this.listView = new ListViewController(this);
    this.editorView = new EditorViewController(this);

    const visitKey = "remindeerVisit";
    this.tutorial = new TutorialController(visitKey);

    this.constructor = function(){
        if(localStorage.getItem(visitKey) != null) this.tutorial.hide();

        moment.locale(document.documentElement.lang);
        this.editorView.show(false);

        //
        /* Event Listener */
        let self = this;
        document.getElementById("nav__themeselector").addEventListener('change', function (e) {
            self.theme.onChange(e.target.value);
        });
    };
    this.constructor();
}