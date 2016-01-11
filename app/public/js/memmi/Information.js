define(["knockout", "showdown", "bbcode"], function(ko, showdown, bbcode){
    var mdProcess = new showdown.Converter();
    var bbProcess = new bbcode.Parser();
    function Information(type, value){
        this.Type = ko.observable(type || 'text');
        this.Value = ko.observable(value || 'Blank Card.');
        this.Html = ko.computed(function(){
            switch(this.Type()){
                case 'markdown':
                   return mdProcess.makeHtml(this.Value()); 
                
                case 'bbcode':
                    return bbProcess.toHTML(this.Value());
                   
                default:
                    return this.Value();
            }
        }, this);
    }

    return Information;
});
