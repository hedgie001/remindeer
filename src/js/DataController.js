/**
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
}