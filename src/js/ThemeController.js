/**
 * Created by Hedgehog on 16.05.18.
 */
function ThemeController(mainController){
    this.currentTheme = "default";
    this.onChange = function(value){
        console.log("Change Theme to: "+value);
        this.currentTheme = value;
    };
}