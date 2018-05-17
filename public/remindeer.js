var mainController = new MainController();;/**
 * Created by Hedgehog on 17.05.18.
 */
function DataController(){
    this.mockUpData = {
        "api": "1.0.0",
        "empty" : false,
        "notes": [{
            "id": 1,
            "active": true,
            "title" : "Item 1",
            "date": 1526548760024,
            "description": "Text 1",
            "importance": 3
        },
        {
            "id": 2,
            "active": true,
            "title" : "Item 2",
            "date": 1526548760024,
            "description": "Text 2",
            "importance": 4
        },
        {
            "id": 3,
            "active": false,
            "title" : "Item 33",
            "date": 1526548760024,
            "description": "Text 4",
            "importance": 5
        }]
    };
    this.getData = function(){
        return this.mockUpData;
    };
};/**
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
};/**
 * Created by Hedgehog on 16.05.18.
 */
function Note(){
    console.log("Note Object");
};/**
 * Created by Hedgehog on 16.05.18.
 */
function ThemeController(){
    console.log("Theme Controller");
}