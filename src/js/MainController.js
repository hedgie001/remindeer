/**
 * Created by Hedgehog on 16.05.18.
 */
function MainController(){

    this.data = new DataController().getData();

    this.populateData = function(){
        var output = "";

        if(!this.data.empty){
            let template = document.getElementById("list__item__template").innerHTML;
            Mustache.parse(template);

            this.data.notes.forEach(function(elem, index){
                output += Mustache.render(template, elem);
            });
        } else {
            output = Mustache.render(document.getElementById("list__nodata__template").innerHTML);
        }

        document.getElementById('list__container').innerHTML = output;

    };
    this.populateData();
}