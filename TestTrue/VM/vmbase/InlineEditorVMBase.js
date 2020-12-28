import FormVMBase from './FormVMBase.js'
import {NotImplementedError} from '../Scripts/Errors.js'
export default class InlineEditorVMBase extends FormVMBase {
    constructor(){
        super();
    }

    defineMethods(methods) {
        super.defineMethods(methods);
        methods.loadOriginal = this.loadOriginal;
        methods.saveOriginal = this.saveOriginal;
        methods.save = this.save;
        methods.remove = this.remove;
        methods.saveData = this.saveData;
        methods.removeData = this.removeData;
        methods.cancelEdit = this.cancelEdit;
    }

    defineData(data) {
        super.defineData(data);
        data.originalData = null;
        data.parentVM = null;
        data.isNewCreate = true;
        data.onEditEnded = null;
    }

    loadOriginal(original) {
        throw new NotImplementedError();
    }

    saveOriginal(original) {
        throw new NotImplementedError();
    }

    save() {
        let self = this;
        return new Promise((resolve, reject) => {
            if (!self.checkValidate())
                return;
            let callback = data => {
                self.uncheckValidate();
                resolve(data);
                if (self.onEditEnded)
                    self.onEditEnded(this);
                self.parentVM.search();
            };
            this.saveData(callback);
        });    
    }

    saveData() {
        throw new NotImplementedError();
    }

    remove() {
        this.removeData();
        //this.parentVM.search();
    }

    removeData(callback) {
        throw new NotImplementedError();
    }

    cancelEdit() {
        if (this.isNewCreate == false) {
            this.loadOriginal(this.originalData);
        }
        else {
            this.parentVM.cancelAdd(this);
        }

        if (this.onEditEnded)
            this.onEditEnded(this);
    }
}