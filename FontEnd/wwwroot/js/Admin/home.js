
class MyComponent {
    constructor() {
        this.$el = null;
        this.table_direct = null;
    }

    init() {
        this.$el = $("#homeContainer");

        this._activeTab();
    }
    _activeTab() {
        $("#nav-option .nav-link").removeClass("active");
        $("#home-link").addClass("active");
    }

}
$(document).ready(function () {
    const myComponent = new MyComponent();
    myComponent.init();
});