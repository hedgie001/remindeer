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
        this.populateData(mainController.notesStorage.getNotes(this.currentSort, this.showDone));
    };

    this.populateData = function(notes){
        var output = "";
        let template = null;
        if(notes.length > 0){
            template = document.getElementById("list__item__template").innerHTML;
            let importanceIconTemplate = document.getElementById("list__item__importance__icon__template").innerHTML;

            Mustache.parse(template);
            Mustache.parse(importanceIconTemplate);

            notes.forEach(function(elem, index){
                let itemData = Object.assign({}, elem);
                itemData.dateFormatted = moment(elem.date).format('ll');
                itemData.theme = mainController.theme.currentTheme;
                itemData.importanceIcons = "";
                for(var i=0;i<5;i++){
                    itemData.importanceIcons += Mustache.render(importanceIconTemplate, (i<itemData.importance ? {active: true} : {active: false}));
                }
                output += Mustache.render(template, itemData);
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
        let note = mainController.notesStorage.getNoteById(id);
        note.active = checkbox.checked;
        mainController.notesStorage.updateLocalNote(note);
        setTimeout(function(){
            if(!self.showDone){
                elem.classList.add("list__item--fadeout");
                elem.style.height = "0px";
            }
            else self.update();
        }, 500+(Math.random()*1000));
    };
    this.setActives = function(checked){
        this.showDone = checked;
        this.update();
    };
    this.constructor();
}
