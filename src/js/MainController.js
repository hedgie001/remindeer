/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){
    this.data = new DataController(this);
    this.editor = new EditorController(this);
    this.theme = new ThemeController(this);

    this.showDone = false;
    this.currentSort = "due";

    this.init = function(){
        document.getElementById("sort-"+this.currentSort).checked = true;

        this.data.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(this.data.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                for(var i=0;i<5;i++){
                    elem.importanceIcons += "<i class=\"list__item__importance__icon "+(i<elem.importance ? "list__item__importance__icon--active" : "")+"\">•</i>";
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
        let note = this.getNoteById(id);
        note.active = checkbox.checked;
        this.data.saveLocalNote(note);
        /*setTimeout(function(){
            alert("delay");
        }, 2500);*/
        this.init();
    };
    this.getNoteById = function(id){
        let note = new Note();
        this.data.notes.forEach(function(elem, index){
            if(elem.id == id) {
                note.update(elem);
            }
        });
        return note;
    };
    this.setActives = function(checkbox){
        this.showDone = checkbox.checked;
        this.init();
    };
}
