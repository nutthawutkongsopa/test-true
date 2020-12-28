import ViewModelBase from "./ViewModelBase.js";
import {NotImplementedError} from '../Scripts/Errors.js'
export default class TreeEditorVMBase extends ViewModelBase {
    constructor(){
        super();
    }

    defineData(data){
        super.defineData(data);
        data.isEditing = false;
        data.originalData = null;
        data.treeNode = null;
        data.searchVM = null;
        data.isNewCreate = true;
    }

    defineMethods(methods){
        super.defineMethods(methods);
        methods.loadOriginal = this.loadOriginal;
    }

    defineComputed(computed){
        super.defineComputed(computed);
        computed.treeNodeText = this.treeNodeText;
    }

    loadOriginal(originalData){
        throw new NotImplementedError();
    }
    saveOriginal(originalData){
        throw new NotImplementedError();
    }
    save(){
        let self = this;
        let callback = () => {
            self.load();
        };
        this.saveData(callback);
    }

    remove(){
        let self = this;
        let callback = () => self.actionAfterRemove();
        this.removeData(callback);
    }

    load(){
        let self = this;
        //let loadParms = this.loadParms;
        let callback = originalData => {
            self.originalData = originalData;
            self.loadOriginal(originalData);
            self.isNewCreate = false;
            self.treeNode.text = self.treeNodeText();
        }
        this.loadData(callback);
        this.endEdit();
    }

    saveData(callback){
        throw new NotImplementedError();
    }

    removeData(callback){
        throw new NotImplementedError();
    }

    loadData(callback){
        throw new NotImplementedError();
    }

    actionAfterRemove(){
        throw new NotImplementedError();
    }

    treeNodeText(){
        throw new NotImplementedError();
    }

    addNewChild(){
        this.searchVM.addNewChild(this.treeNode);
    }

    cancelEdit(){
        if(this.isNewCreate == true){
            if(this.treeNode.parent){
                this.treeNode.parent.selected();
                this.treeNode.remove();
            }
            else{
                this.searchVM.clearSelect();
            }
        }
        else{
            this.loadOriginal(this.originalData);
        }
    }
}