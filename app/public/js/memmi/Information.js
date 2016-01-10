define(["knockout", "showdown"], function(ko, showdown){
    var converter = new showdown.Converter();
    function Information(type, value){
        this.Type = ko.observable(type || 'text');
        this.Value = ko.observable(value || 'Blank Card.');
        this.Html = ko.computed(function(){
            switch(this.Type()){
                case 'markdown':
                   return converter.makeHtml(this.Value()); 
                   
                default:
                    return this.Value();
            }
        }, this);
    }

    return Information;
});
