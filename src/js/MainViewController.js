/**
 * Created by Hedgehog on 16.05.18.
 */
function MainViewController(){
    this.editor = new EditorViewController(this);
    this.notesStorage = new NotesStorage(this);
    this.theme = new Theme(this);

    this.showDone = false;
    this.currentSort = "due";

    this.constructor = function(){
        this.editor.show(false);

        //Event Listeners
        let self = this;
        document.getElementById("list__container").addEventListener('click', function (e) {
            let type = e.target.type;
            if(type == "submit") self.editor.show(true, e.target.dataset.id);
            if(type == "checkbox") self.activate(e.target.dataset.id, e.target);
        });
        document.getElementById("list__fab").addEventListener('click', function (e) {
            self.editor.show(true);
        });
        document.getElementById("nav__themeselector").addEventListener('change', function (e) {
            self.theme.onChange(e.target.value);
        });
        document.getElementById("nav__showdone").addEventListener('change', function(e){
            self.setActives(e.target.checked);
        });
        document.getElementById('list-wrapper').addEventListener('change', function (e) {
            if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
                self.currentSort = e.target.value;
                self.init();
            }
        });
        this.init();
    };

    this.init = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        this.notesStorage.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(this.notesStorage.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let theme = this.theme.currentTheme;

            Mustache.parse(template);

            this.notesStorage.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                elem.theme = theme;
                for(var i=0;i<5;i++){
                    elem.importanceIcons += "<i class=\"list__item__importance__icon "+(i<elem.importance ? "list__item__importance__icon--active" : "")+"\"></i>";
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
        let note = this.notesStorage.getNoteById(id);
        let self = this;
        note.active = checkbox.checked;
        this.notesStorage.updateLocalNote(note);
        setTimeout(function(){
            self.init();
        }, 2500);
    };
    this.setActives = function(checked){
        this.showDone = checked;
        this.init();
    };
    this.constructor();
}
