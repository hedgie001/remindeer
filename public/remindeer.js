var mainController = new MainController();;/**
 * Created by Hedgehog on 17.05.18.
 */
function DataController(){
    this.mockUpData = {
        "api": "1.0.0",
        "empty" : false,
        "notes": [{
            "active": true,
            "title" : "Item 1",
            "date": 1526548760024,
            "description": "Text 1",
            "importance": 3
        },
        {
            "active": true,
            "title" : "Item 2",
            "date": 1526548760024,
            "description": "Text 2",
            "importance": 4
        },
        {
            "active": true,
            "title" : "Item 3",
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
    var data = new DataController().getData();
    console.log(data);
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