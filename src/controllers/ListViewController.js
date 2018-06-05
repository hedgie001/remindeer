/**
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
        mainController.notesStorage.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(mainController.notesStorage.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let importanceIconTemplate = document.getElementById("list__item__importance__icon__template").innerHTML;
            let theme = mainController.theme.currentTheme;

            Mustache.parse(template);
            Mustache.parse(importanceIconTemplate);

            mainController.notesStorage.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                elem.theme = theme;
                for(var i=0;i<5;i++){
                    elem.importanceIcons += Mustache.render(importanceIconTemplate, (i<elem.importance ? {active: true} : {active: false}));
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
