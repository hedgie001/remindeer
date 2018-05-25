document.addEventListener("DOMContentLoaded", function(event) {

    moment.locale(document.documentElement.lang);

    let mainController = new MainController();

    //Event Listeners
    let list = document.getElementById("list__container");
    list.addEventListener('click', function (e) {
        let type = e.target.type;
        if(type == "submit") mainController.editor.show(true, e.target.dataset.id);
        if(type == "checkbox") mainController.activate(e.target.dataset.id, e.target);
    });
    let listCreate = document.getElementById("list__fab");
    listCreate.addEventListener('click', function (e) {
        mainController.editor.show(true);
    });
    let editorCreate = document.getElementById("editor__closebutton");
    editorCreate.addEventListener('click', function (e) {
        mainController.editor.show(false);
    });
    let editorClose = document.getElementById("editor__savebutton");
    editorClose.addEventListener('click', function (e) {
        mainController.editor.submit();
    });
    let editorImportanceIcons = document.getElementsByClassName("editor__listgroup__importanceselector_listitem");
    for (let icon of editorImportanceIcons) {
        let anchor = icon.getElementsByTagName("a")[0];
        anchor.addEventListener('mouseover', mainController.editor.editorImportanceIconOver.bind(this));
        anchor.addEventListener('mouseout', mainController.editor.editorImportanceIconOut.bind(this));
        anchor.addEventListener('click', mainController.editor.editorImportanceIconClick.bind(this));
    } 
    let themeSelector = document.getElementById("nav__themeselector");
    themeSelector.addEventListener('change', function (e) {
        mainController.theme.onChange(e.target.value);
    });
    let showDone = document.getElementById("nav__showdone");
    showDone.addEventListener('change', function(e){
        mainController.setActives(e.target.checked);
    });
    let listChange = document.getElementById('list-wrapper');
    listChange.addEventListener('change', function (e) {
        if(e.target.tagName.toLowerCase() === 'input' && e.target.type === 'radio') {
            mainController.currentSort = e.target.value;
            mainController.init();
        }
    });
    mainController.init();
});

//HELPERS
function HideElementById(selector){
    document.getElementById(selector).style.display = "none";
}
function ShowElementById(selector){
    document.getElementById(selector).style.display = "block";
}

