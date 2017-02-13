(function(w,d) {
    /**
     * Validation rules
     * @type {{actualLink: {url: boolean, presence: boolean}, desiredShorten: {length: {minimum: number, maximum: number}}}}
     */
    var FORM_CONSTRAINS = {
        actualLink: {url: true, presence:true },
        desiredShorten: {length: {minimum: 3, maximum: 10}}
    }
    
    var LAST_SEMICOLON_REGEXP = /, $/;

    /**
     * Constructor
     * @param id
     * @constructor
     */
    function ShrtnrForm(id){
        this.formNode = d.getElementById(id);
        this.actualLinkInput = this.formNode.querySelector('.actualLink');
        this.desiredShortenInput = this.formNode.querySelector('.desiredShorten');
        this.submitFormButton = this.formNode.querySelector('.submitShorten');
        this.formInner = this.formNode.querySelector('.formInner');
        this.formErrorNode = this.formNode.querySelector('.formError');
        this.link = this.formNode.querySelector('.link');
        this.linkA = this.link.querySelector('a');
        this.linkB = this.link.querySelector('button');
        this.bindEvents();
    }
    /**
     * Bind all form events
     */
    ShrtnrForm.prototype.bindEvents = function(){
        this.submitFormButton.addEventListener('click',this.submitForm.bind(this));
        this.linkB.addEventListener('click',function(e){e.preventDefault();this.showLink(false);}.bind(this));
    }
    /**
     * Collect information and send request
     * @param e
     */
    ShrtnrForm.prototype.submitForm = function(e){
        e.preventDefault();
        this.clearValidationErrors();
        var values = validate.collectFormValues(this.formNode);
        var validationResults = validate(values,FORM_CONSTRAINS);
        if(validationResults) return this.showValidationErrors(validationResults);
        this.loading(true);
        fetch('/',{method:'POST',body: JSON.stringify(values),headers:{'Content-Type':'application/json'}}).then(function(response){
            return response.json();
        }).then(function(json){
            this.loading(false);
            if(!json.success&&json.code&&json.code===500) return this.showError('Your url is unreachable...');
            if(!json.success) return this.showError(json.message);
            // Clean form
            this.actualLinkInput.value = '';
            this.desiredShortenInput.value = '';
            // Ok
            var urlRecord = json.url;
            var link = location.protocol+'//'+location.host+'/'+urlRecord.shortening;
            this.linkA.innerText = this.linkA.href = link;
            this.showLink(true);
        }.bind(this)).catch(function (e) {
            this.loading(false);
            this.showError(e.message);
        }.bind(this));
    }
    /**
     * Show all validation errors
     * @param validationErrors
     */
    ShrtnrForm.prototype.showValidationErrors = function(validationErrors){
        var msg = '';
        Object.keys(validationErrors).forEach(function(errorKey){
            msg+=validationErrors[errorKey].join(', ')+', ';
        },this);
        msg = msg.replace(LAST_SEMICOLON_REGEXP,'');
        this.showError(msg);
    }
    /**
     * Show error
     * @param errorMessage
     */
    ShrtnrForm.prototype.showError = function(errorMessage){
        this.formErrorNode.innerText = errorMessage;
        this.formErrorNode.classList.remove('hide');
    }
    /**
     * Hide validation message
     * @param validationErrors
     */
    ShrtnrForm.prototype.clearValidationErrors = function(validationErrors){
        this.formErrorNode.classList.add('hide');
    }
    /**
     * Show link | Hide form
     */
    ShrtnrForm.prototype.showLink = function(show){
        var state = show ? 'remove' : 'add';
        var revertState = !show ? 'remove' : 'add';
        this.link.classList[state]('hide');
        this.formInner.classList[revertState]('hide');
    }
    /**
     * Loading state for a button
     */
    ShrtnrForm.prototype.loading = function(state){
        var message = state ? 'LOADING...' : 'SHORTEN';
        this.submitFormButton.value = message;
    }
    // Export
    w.ShrtnrForm = ShrtnrForm;
})(window,document);
