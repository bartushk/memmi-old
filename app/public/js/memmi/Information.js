define(["knockout"], function(ko, showdown, bbcode){
    function Information(type, value){
        this.Type = ko.observable(type || 'text');
        this.Value = ko.observable(value || 'Blank Card.');
    }

    return Information;
});
