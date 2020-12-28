import FormVMBase from './FormVMBase.js'
import { NotImplementedError } from '../../asset/js/Errors.js'

export default class DocEditorVMBase extends FormVMBase {
    constructor() {
        super();
    }

    defineMethods(methods) {
        super.defineMethods(methods);
        methods.loadOriginal = this.loadOriginal;
        methods.saveOriginal = this.saveOriginal;
        methods.save = this.save;
        methods.remove = this.remove;
        methods.load = this.load;
        methods.beginEdit = this.beginEdit;
        methods.endEdit = this.endEdit;
        methods.onBeginEdit = this.onBeginEdit;
        methods.onEndEdit = this.onEndEdit;
        methods.saveData = this.saveData;
        methods.loadData = this.loadData;
        methods.removeData = this.removeData;
        methods.cancelEdit = this.cancelEdit;
        methods.actionAfterRemove = this.actionAfterRemove;
    }

    defineComputed(computed) {
        super.defineComputed(computed);
        computed.loadParms = this.loadParms;
        computed.isNewCreate = function () { return !this.originalData };
    }

    defineData(data) {
        super.defineData(data);
        data.originalData = null;
        data.isEditing = true;
    }

    loadOriginal(original) {
        throw new NotImplementedError();
    }

    saveOriginal(original) {
        throw new NotImplementedError();
    }

    save() {
        if (!this.checkValidate())
            return;
        let self = this;
        let callback = () => {
            self.uncheckValidate();
            self.load();
        };
        this.saveData(callback);
    }

    remove() {
        let self = this;
        let callback = () => self.actionAfterRemove();
        this.removeData(callback);
    }

    load() {
        this.isBusy = true;
        let self = this;
        let loadParms = this.loadParms;
        let callback = originalData => {
            self.originalData = originalData;
            self.loadOriginal(originalData);
            self.isBusy = false;
        }
        this.loadData(loadParms, callback);
        this.endEdit();
    }

    saveData(callback) {
        throw new NotImplementedError();
    }

    removeData(callback) {
        throw new NotImplementedError();
    }

    loadData(loadParms, callback) {
        throw new NotImplementedError();
    }

    actionAfterRemove() {
        throw new NotImplementedError();
    }

    cancelEdit() {
        if (!this.originalData) {
            alertMessage('Cannot cancel edit because the data is new create.');
            return;
        }
        this.loadOriginal(this.originalData);
        this.endEdit();
    }

    beginEdit() {
        this.isEditing = true;
        this.onBeginEdit();
    }

    endEdit() {
        this.isEditing = false;
        this.uncheckValidate();
        this.onEndEdit();
    }
    onBeginEdit() {
        throw new NotImplementedError();
    }

    onEndEdit() {
        throw new NotImplementedError();
    }

    loadParms() {
        throw new NotImplementedError();
    }
}