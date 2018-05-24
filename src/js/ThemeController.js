/**
 * Created by Hedgehog on 16.05.18.
 */
function ThemeController(mainController){
    this.currentTheme = "default";
    this.onChange = function(newTheme){
        console.log("Change Theme to: "+newTheme);
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
    };
}