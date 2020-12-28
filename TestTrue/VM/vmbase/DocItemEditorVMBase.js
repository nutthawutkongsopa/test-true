import DocItemSearchVM from "./DocItemSearchVMBase.js";
import FormVMBase from "./FormVMBase.js";
import { NotImplementedError } from '../../asset/js/Errors.js'

export default class DocItemEditorVMBase extends FormVMBase {
    constructor() {
        super();
    }
    defineData(data) {
        super.defineData(data);
        data.tempData = {};
        data.isEditing = false;
        data.parentVM = null;
        data.isNewCreate = true;
        data.originalData = null;
    }

    defineMethods(methods) {
        super.defineMethods(methods);
        methods.loadOriginal = this.loadOriginal;
        methods.saveOriginal = this.saveOriginal;
        methods.commitChange = this.commitChange;
        methods.cancelChange = this.cancelChange;
        methods.beginEdit = this.beginEdit;
        methods.endEdit = this.endEdit;
        methods.onBeginEdit = this.onBeginEdit;
        methods.onEndEdit = this.onEndEdit;
    }

    defineWatch(watch) {
        super.defineWatch(watch);
        watch.parentVM = this.onParentVMChanged;
    }

    loadOriginal(original) {
        throw new NotImplementedError();
    }

    saveOriginal(original) {
        throw new NotImplementedError();
    }

    commitChange() {
        this.tempData = {};
        this.saveOriginal(this.tempData);
        this.isNewCreate = false;
    }

    cancelChange() {
        if (this.isNewCreate != false) {
            this.parentVM.removeItem(this);
        }
        else {
            this.loadOriginal(this.tempData);
        }
    }

    onParentVMChanged(parentVM) {

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
        //action to child vm 
    }

    onEndEdit() {
        //action to child vm 
    }
}
