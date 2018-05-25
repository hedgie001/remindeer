/**
 * Created by Hedgehog on 16.05.18.
 */
function ThemeController(mainController){
    this.styleThemeKey = "remindeerTheme";
    this.currentTheme = "default";
    this.onChange = function(newTheme){
        this.redraw(newTheme);
    };
    this.redraw = function(newTheme = null){
        let oldTheme = this.currentTheme;
        let changeClassTheme = function(classContent){
            return classContent.replace("--"+oldTheme, "--"+newTheme);
        };
        let allNodes = document.querySelectorAll('*');
        allNodes.forEach(function(node) {
            let classContent = node.getAttribute("class");
            if(classContent){
                node.setAttribute("class", changeClassTheme(classContent));
            }
        });
        this.currentTheme = newTheme;
        localStorage.setItem(this.styleThemeKey, this.currentTheme);
        document.getElementById("nav__themeselector").value = this.currentTheme;
    };
    let localTheme = localStorage.getItem(this.styleThemeKey);
    if (localTheme) this.redraw(localTheme);
}