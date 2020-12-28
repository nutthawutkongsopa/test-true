import ViewModelBase from './ViewModelBase.js'

export default class FormVMBase extends ViewModelBase {
    constructor() {
        super();

        let validats = {};
        this.defineValidates(validats);
        let validationSet = {};
        validationSet[0] = validats;
        this.defineValidationSet(validationSet);

        Object.keys(validationSet).forEach(k1 => {
            this.data.validationSet[k1] = {};
            this.data.validationSet[k1].isCheckValidate = false;
            this.data.validationSet[k1].fields = [];
            Object.keys(validationSet[k1]).forEach(k2 => {
                this.data.validationSet[k1].fields.push(k2);
                let func = function () { return null; };

                if (validationSet[k1][k2] && validationSet[k1][k2].constructor == Object) {
                    let obj = validationSet[k1][k2];
                    let key = Object.keys(obj)[0];
                    let filedName = obj[key];
                    func = function () {
                        if (this.validationFields[filedName]) {
                            return this.validationFields[filedName].call(this, this[key]);
                        }
                        return null;
                    }
                }
                else {
                    func = validationSet[k1][k2];
                }

                this.computed[k2] = function () {
                    return buildValidationResult.call(this, func, this.validationSet[k1].isCheckValidate);
                };
            });
        });
    }

    defineMethods(methods) {
        super.defineMethods(methods);
        methods.checkValidate = this.checkValidate;
        methods.uncheckValidate = this.uncheckValidate;
        methods.loadValidation = this.loadValidation;
    }

    defineData(data) {
        super.defineData(data);
        data.isBusy = false;
        data.validationSet = {};
        data.validationFields = {};
        data.validationCode = null;
    }

    defineValidates(validats) {

    }

    defineValidationSet(validationSet) {

    }

    loadValidation(validationCode, date = null) {
        const self = this;
        axios
            .post(baseURL + 'api/Validation/GetJsValidation', { validationCode: validationCode, date: date ? new Date(date) : null })
            .then(response => {
                self.validationFields = {};
                response.data.forEach(t => {
                    self.validationFields[t.FieldName] = eval('let func = ' + t.JsFunction + '; func;');
                });
            })
            .catch(err => onAxiosError(err));
    }

    checkValidate(set = 0) {
        this.validationSet[set].isCheckValidate = true;
        let result = true;
        this.validationSet[set].fields.forEach(item => {
            result = result && this[item].isValid;
        });
        return result;
    }

    uncheckValidate(set = 0) {
        this.validationSet[set].isCheckValidate = false;
    }

    created() {
        super.created();
        if (this.validationCode)
            this.loadValidation(this.validationCode);
    }
}