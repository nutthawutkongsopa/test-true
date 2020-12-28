import ViewModelBase from "./ViewModelBase.js";
import {NotImplementedError} from '../Scripts/Errors.js'
export default class TreeSearchVMBase extends ViewModelBase{
    constructor(){
        super();
    }
    defineData(data){
        super.defineData(data);
        data.tree = null;
        data.treeOptions = {};
        data.selectedEditor = null;
        data.selectedNode = null;
    }
    defineMethods(methods){
        super.defineMethods(methods);
        methods.Load = this.Load;
        methods.createEditorVM = this.createEditorVM;
        methods.searchRootData = this.searchRootData;
        methods.initialLoadItem = this.initialLoadItem;
        methods.initialEditItem = this.initialEditItem;
        methods.loadChilds = this.loadChilds;
        methods.onSelectChange = this.onSelectChange;
        methods.onSelected = this.onSelected;
        methods.loadChildData = this.loadChildData;
        methods.onNodeSelected = this.onNodeSelected;
    }

    //root node
    Load(){
        let self = this;
        self.isBusy = true;
        let callback = function(searchResult){
            let i = 0;
            let items = [];
            for(i = 0; i < searchResult.length; i++){
                let originalData = searchResult[i];
                let editorVM = self.createEditorVM();
                editorVM.searchVM = self;
                editorVM.originalData = originalData;
                editorVM.loadOriginal(originalData);
                let treeNode = self.tree.tree.parse({})[0];
                editorVM.treeNode = treeNode;
                treeNode.data = editorVM;
                treeNode.text = editorVM.treeNodeText;
                items.push(treeNode);
            }
            self.isBusy = true;
            //self.$set(self.$refs.tree, 'model', items)
            self.tree.model = items;           
        }
        self.searchRootData(callback);
        
    }
    createEditorVM(){
        throw new NotImplementedError();
    }

    searchRootData(callback){
        throw new NotImplementedError();
    }

    initialLoadItem(editorVM){

    }

    initialAddItem(editorVM){

    }

    loadChilds(item){
        let self = this;
        let callback = function(searchResult){
            item.children = [];
            for(let i = 0; i < searchResult.length; i++){
                let originalData = searchResult[i];
                let editorVM = self.createEditorVM();
                editorVM.isNewCreate = false;
                editorVM.searchVM = self;
                editorVM.originalData = originalData;
                editorVM.loadOriginal(originalData);
                let treeNode = self.tree.tree.parse({})[0];
                editorVM.treeNode = treeNode;
                treeNode.data = editorVM;
                treeNode.text = editorVM.treeNodeText;
                item.append(treeNode);
            }
            item.expand();
        }
        this.loadChildData(item,callback);
    }

    onNodeSelected(node){
        if(node.children.length == 0)
        {
            this.loadChilds(node);
        }
        
        this.selectedEditor = node.data;
        this.selectedNode = node;
        this.selectedEditor = node.data;
        this.onSelected(node.data);
    }

    onSelected(editorVM){
        throw new NotImplementedError();
    }

    loadChildData(item, callback){
        throw new NotImplementedError();
    }

    created(){
        super.created();
        this.treeOptions = {
            //checkbox: true,
            propertyNames: {
              text: this.displayProp,
            },
        };
    }
    mounted(){
        super.mounted();
        this.tree = this.$refs.tree;
    }

    addNewChild(parentNode){
        let editorVM = self.createEditorVM();
        editorVM.isNewCreate = false;
        editorVM.searchVM = self;
        let treeNode = self.tree.tree.parse(editorVM)[0];
        editorVM.treeNode = treeNode;
        editorVM.beginEdit();
        treeNode.data = editorVM;
        treeNode.text = editorVM.treeNodeText;
        parentNode.append(treeNode);
        treeNode.select();
    }

    clearSelect(){
        if(this.selectedEditor)
            this.selectedEditor = null;
        if(this.selectedNode)
            this.selectedNode.unselect();
            this.selectedNode = null;
    }
}