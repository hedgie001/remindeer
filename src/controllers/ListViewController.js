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
            if(type == "submit") mainController.editorView.show(true, e.target.dataset.id); //Click on Edit Button
            if(type == "checkbox") self.activate(e.target.dataset.id, e.target); //Click on Checkbox
        });
        document.getElementById("list__fab").addEventListener('click', function (e) {
            mainController.editorView.show(true); //Click on Floating Action Button
        });
        document.getElementById("nav__showdone").addEventListener('change', function(e){
            self.setActives(e.target.checked); //Click on ShowDone Button
        });
        document.getElementById('list-wrapper').addEventListener('change', function (e) {
            if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
                self.currentSort = e.target.value;
                self.update();
            }
        }); //Click on Sort Radio Buttons
        this.update();
    };

    this.update = function(){
        document.getElementById("sort__"+this.currentSort).checked = true;
        let self = this;
        mainController.notesStorage.getNotes(this.currentSort, this.showDone, function (notes){
           self.renderList(notes);
        });
    };

    this.renderList = function(notes){
        let output = "";
        let template = null;
        if(notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let importanceIconTemplate = document.getElementById("list__item__importance__icon__template").innerHTML;

            Mustache.parse(template);
            Mustache.parse(importanceIconTemplate);

            notes.forEach(function(note, index){
                let itemTemplateData = Object.assign({}, note);
                itemTemplateData.dateFormatted = moment(note.date).format('ll');
                itemTemplateData.theme = mainController.theme.currentTheme;
                itemTemplateData.importanceIcons = "";
                itemTemplateData._id = note._id;
                itemTemplateData.checked = (note.status === "DONE" ? true : false);
                for(var i=0;i<5;i++){
                    itemTemplateData.importanceIcons += Mustache.render(importanceIconTemplate, (i<itemTemplateData.importance ? {active: true} : {active: false}));
                }
                output += Mustache.render(template, itemTemplateData);
            });
        } else {
            template = document.getElementById("list__nodata__template").innerHTML;
            output = Mustache.render(template);
        }

        document.getElementById('list__container').innerHTML = output;

        let overlays = document.getElementsByClassName('list__item__overlay');
        [...overlays].forEach(function(elem) {
            elem.style.display = "none";
        });
    };
    this.activate = function(id, checkbox){
        let elem = document.getElementById("list__item__id__"+id);
        elem.style.height = (elem.clientHeight-30)+"px";
        elem.querySelector('.list__item__overlay').style.display = "flex";
        let self = this;
        mainController.notesStorage.getNoteById(id, function (note) {
            note.status = checkbox.checked ? "DONE" : "UNDONE";
            mainController.notesStorage.updateNote(note, function (){
                if(!self.showDone){
                    elem.classList.add("list__item--fadeout");
                    elem.style.height = "0px";
                }
                else self.update();
            });
        });

    };
    this.setActives = function(checked){
        this.showDone = checked;
        this.update();
    };
    this.constructor();
}
