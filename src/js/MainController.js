/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){
    this.data = new DataController(this);
    this.editor = new EditorController(this);

    this.init = function(sortBy){
        if(sortBy){
            document.getElementById("sort-"+sortBy).checked = true;
        }
        this.data.getNotes(sortBy);
        this.populateData();
    };

    this.populateData = function(){
        var output = "";

        if(this.data.notes.length > 0){
            let template = document.getElementById("list__item__template").innerHTML;
            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                elem.dateFormatted = moment(elem.date).format('ll');
                output += Mustache.render(template, elem);
            });
        } else {
            output = Mustache.render(document.getElementById("list__nodata__template").innerHTML);
        }
        document.getElementById('list__container').innerHTML = output;
    };
}
