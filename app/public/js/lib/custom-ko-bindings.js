require(["jquery", "knockout"], function($, ko){
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function(element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            if(ko.unwrap(value)){
                $(element).fadeIn(); 
            }else{
                $(element).fadeOut();
            }
        }
    };

    ko.bindingHandlers.onEnter = {
        update: function(element, valueAccessor, allBindings, viewModel){
            $(element).removeAttr('onkeypress');
            $(element).keypress(function(event){
                $(element).trigger('change'); // make sure the observable updates where you're hitting enter from.
                var keyCode = (event.which ? event.which : event.keyCode);
                if(keyCode == 13){ //enter key
                    ko.unwrap(valueAccessor()).call(viewModel);
                    return false;
                }
                return true;
            });
        }
    };
});
