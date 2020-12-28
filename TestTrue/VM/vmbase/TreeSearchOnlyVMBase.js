import ViewModelBase from "./ViewModelBase.js";
import {NotImplementedError} from '../../asset/js/Errors.js'

export default class TreeSearchOnlyVMBase extends ViewModelBase{
    constructor(){
        super();
    }
    defineData(data){
        super.defineData(data);
        data.tree = null;
        data.displayProp = null;
        data.parentKeyProp = null;
        data.keyProp = null;
        data.treeOptions = {checkbox:true};
        data.defaultCheckeds = [];
    }

    defineMethods(methods){
        methods.load = this.load;
        methods.loadTreeData = this.loadTreeData;
        methods.buildTreeData = this.buildTreeData;
        methods.getCheckedItems = this.getCheckedItems;
    }

    load(){
        let self = this;
        let callback = function(searchResult){
            let treeNodes = [];
            self.buildTreeData(searchResult,treeNodes,null);
            self.tree.model = treeNodes;
        }
        this.loadTreeData(callback);
    }

    loadTreeData(callback){
        throw new NotImplementedError();
    }

    buildTreeData(source,outArray,parentNode){
        let items = [];
        if(parentNode == null){
            items = source.filter(x => x[this.parentKeyProp] == null);
        }
        else{
            items = source.filter(x => x[this.parentKeyProp] == parentNode.data[this.keyProp]);
        }
        for(let i = 0; i < items.length; i++){
            let item = items[i];
            let isChecked = this.defaultCheckeds.includes(item[this.keyProp]);
            let treeNode = this.tree.tree.parse({})[0];
            treeNode.data = item;
            treeNode.text = item[this.displayProp];
            treeNode.states.checked = isChecked; 
            if(parentNode == null){
                outArray.push(treeNode);
            }
            else{
                parentNode.append(treeNode);
            }
            this.buildTreeData(source,outArray,treeNode);
            
        }
    }

    getCheckedItems(){
        return this.$refs.tree.checked().map(t=>t.data);
    }
    mounted(){
        super.mounted();
        this.tree = this.$refs.tree;
    }
}