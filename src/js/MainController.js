/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){
    this.data = new DataController(this);
    this.editor = new EditorController(this);
    this.editor.show(false);
    this.theme = new ThemeController(this);

    this.showDone = false;
    this.currentSort = "due";

    this.init = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        this.data.getNotes(this.currentSort, this.showDone);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";
        let template = null;
        if(this.data.notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let theme = this.theme.currentTheme;

            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                elem.importanceIcons = "";
                elem.theme = theme;
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
        let note = this.data.getNoteById(id);
        note.active = checkbox.checked;
        this.data.saveLocalNote(note);
        /*setTimeout(function(){
            alert("delay");
        }, 2500);*/
        this.init();
    };
    this.setActives = function(checked){
        this.showDone = checked;
        this.init();
    };
}
