import ViewModelBase from './ViewModelBase.js'
import { NotImplementedError } from '../../asset/js/Errors.js'
export default class DocItemSearchVMBase extends ViewModelBase {
    constructor() {
        super();
    }
    defineData(data) {
        super.defineData(data);
        data.items = [];
        data.pageSize = 5;
        data.currentPage = 1;
        data.parentVM = null;
        data.isEditing = false;
        data.selectedItems = [];
        data.pageSizeList = [{ value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 20, text: '20' },
        { value: 50, text: '50' },
        ];
    }
    defineMethods(methods) {
        super.defineMethods(methods);
        methods.loadOriginals = this.loadOriginals;
        methods.saveOriginals = this.saveOriginals;
        methods.beginEdit = this.beginEdit;
        methods.endEdit = this.endEdit;
        methods.createEditorVM = this.createEditorVM;
        methods.onRowSelected = this.onRowSelected;
        methods.initialAddItem = this.initialAddItem;
        methods.initialLoadItem = this.initialLoadItem;
        methods.afterAdd = this.afterAdd;
        methods.afterRemove = this.afterRemove;
        methods.addItem = this.addItem;
        methods.removeItem = this.removeItem;
        methods.removeSelected = this.removeSelected;
        methods.insertEditorVM = this.insertEditorVM;
    }

    defineComputed(computed) {
        super.defineComputed(computed)
        computed.isNotEditing = function () { return !this.isEditing; };
        computed.selectedItem = function () {
            return !this.selectedItems[0] ? {} : this.selectedItems[0];
        };
        computed.hasSelectItem = function () {
            return this.selectedItems.length > 0;
        };
        computed.itemCount = function () {
            return this.items.length;
        }

    }

    defineWatch(watch) {
        super.defineWatch(watch);
        watch.parentVM = this.onParentVMChanged;
        watch.pageSize = function () { this.currentPage = 1; };
    }

    loadOriginals(originals) {
        let i = 0;
        let items = [];
        for (i = 0; i < originals.length; i++) {
            let editorVM = this.createEditorVM();
            editorVM.parentVM = this;
            editorVM.isEditing = this.isEditing;
            editorVM.isNewCreate = false;
            editorVM.tempData = originals[i];
            this.initialLoadItem(editorVM);
            editorVM.loadOriginal(originals[i]);
            items.push(editorVM);
        }
        this.items = items;
    }

    saveOriginals(originals) {
        let i = 0;
        for (i = 0; i < this.items.length; i++) {
            let original = {};
            this.items[i].saveOriginal(original);
            originals.push(original);
        }
    }

    beginEdit() {
        this.isEditing = true;
        this.items.forEach(item => item.beginEdit());
    }
    endEdit() {
        this.isEditing = false;
        this.items.forEach(item => item.endEdit());
    }

    createEditorVM() {
        //return new Vue(new Foo());
        throw new NotImplementedError();
    }

    removeItem(item) {
        this.items.remove(item);
        this.afterRemove(item);
    }

    addItem() {
        let editorVM = this.createEditorVM();
        this.insertEditorVM(editorVM);
        this.afterAdd(editorVM);
        return editorVM;
    }

    insertEditorVM(editorVM) {
        editorVM.parentVM = this;
        if (this.isEditing)
            editorVM.beginEdit();
        this.initialAddItem(editorVM);
        this.items.push(editorVM);
    }

    onRowSelected(items) {
        this.selectedItems = items;
    }

    removeSelected() {
        this.selectedItems.forEach(t => {
            this.removeItem(t)
        });
    }

    onParentVMChanged(parentVM) {

    }

    initialAddItem(editorVM) {

    }
    initialLoadItem(editorVM) {

    }
    afterRemove(editorVM) {

    }
    afterAdd(editorVM) {

    }
}