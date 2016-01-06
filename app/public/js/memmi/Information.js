define(["knockout"], function(ko){
    function Information(type, value){
        this.Type = ko.observable(type || 'text');
        this.Value = ko.observable(value || 'Blank Card.');
    }

    return Information;
});
