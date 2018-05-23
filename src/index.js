var mainController = new MainController();

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("init");
    moment.locale(document.documentElement.lang);
    mainController.init("due");
});
document.getElementById('list-wrapper').onchange = function(e) {
    //Watching for cahnges in sort list
    if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
        mainController.currentSort = e.target.value;
        mainController.init();
    }
};

//HELPERS
function HideElementById(selector){
    document.getElementById(selector).style.display = "none";
}
function ShowElementById(selector){
    document.getElementById(selector).style.display = "block";
}

