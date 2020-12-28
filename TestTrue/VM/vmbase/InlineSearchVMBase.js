import ViewModelBase from './ViewModelBase.js'
import { NotImplementedError } from '../Scripts/Errors.js'
export default class InlineSearchVMBase
    extends ViewModelBase {

    constructor() {
        super();
        this.prepareDefaultSorting.call(this.data);
        this.data.defaultSortBy = this.data.sortBy;
        this.data.defaultSortDesc = this.data.sortDesc;
        let validats = {};
        this.data.validationFields = [];
        this.defineValidates(validats);
        Object.keys(validats).forEach(k => {
            this.data.validationFields.push(k);
            const func = validats[k];
            this.computed[k] = function () {
                return buildValidationResult.call(this, func, this.isCheckValidate);
            };
        });

        const tmpSortMapping = {};
        this.data.fields.forEach(f => {
            if(f.sortPath) {
                tmpSortMapping[f.key] = f.sortPath;
            }
        });

        if(!this.data.sortByMapping && Object.keys(tmpSortMapping).length > 0) {
            this.data.sortByMapping = tmpSortMapping;
        }
        else if(this.data.sortByMapping && Object.keys(tmpSortMapping).length > 0) {
            Object.keys(tmpSortMapping).forEach(k => {
                if(!this.data.sortByMapping[k])
                this.data.sortByMapping[k] = tmpSortMapping[k];
            });
        }
    }

    defineData(data) {
        super.defineData(data);
        data.fields = [];
        data.pageSize = 5;
        data.pageSizeList = [{ value: 5, text: '5' },
        { value: 10, text: '10' },
        { value: 20, text: '20' },
        { value: 50, text: '50' },
        ];
        data.currentPage = 1;
        data.sortByMapping = null;
        data.itemCount = 0;
        data.sortBy = null;
        data.items = [];
        data.isBusy = false;
        data.editItem = {};
        data.sortDesc = false;
        data.selectedItems = [];
        data.isCheckValidate = false;
    }

    defineComputed(computed) {
        super.defineComputed(computed);
        computed.selectedItem = function () {
            return !this.selectedItems[0] ? {} : this.selectedItems[0];
        };
        computed.hasSelectItem = function () {
            return this.selectedItems.length > 0;
        };
    }

    defineMethods(methods) {
        super.defineMethods(methods);
        methods.searchItemProvider = this.searchItemProvider;
        methods.search = this.search;
        methods.searchInternal = this.searchInternal;
        methods.getDataTable = this.getDataTable;
        methods.searchData = this.searchData;
        methods.buildSearchCriteria = this.buildSearchCriteria;
        methods.createEditorVM = this.createEditorVM;
        methods.clearCriteria = this.clearCriteria;
        methods.initialAddItem = this.initialAddItem;
        methods.initialLoadItem = this.initialLoadItem;
        methods.addItem = this.addItem;
        methods.afterAdd = this.afterAdd;
        methods.removeItem = this.removeItem;
        methods.removeItems = this.removeItems;
        methods.cancelAdd = this.cancelAdd;
        methods.rowSelectChange = this.rowSelectChange;
        methods.poke = function (action) {
            this.isPoke = true;
            action();
            this.isPoke = false;
        }
        methods.checkValidate = this.checkValidate;
        methods.uncheckValidate = this.uncheckValidate;
    }

    defineWatch(watch) {
        watch.sortBy = function () {
            this.search();
        };
        watch.currentPage = function () {
            if (!this.isPoke)
                this.searchInternal();
        };
        watch.pageSize = function (val) {
            this.search();
        };
        watch.sortDesc = function () {
            this.search();
        };
    }

    defineValidates(validats) {

    }

    prepareDefaultSorting() {
        //this.sortBy = 'Foo'
        //this.sortDesc = false
        throw new NotImplementedError();
    }

    buildSearchCriteria(sortingCriteria, pagingCriteria) {
        //return {Foo: this.Foo, Sorting: sortingCriteria, Paging: pagingCriteria}
        throw new NotImplementedError();
    }

    searchData(criteria, callback) {
        throw new NotImplementedError();
    }

    searchInternal() {
        let self = this;
        self.isBusy = true;
        let sortBy = self.sortBy;
        if (!sortBy || sortBy == '')
            sortBy = self.defaultSortBy

        let sortDirection = '';

        if (!!self.sortBy)
            sortDirection = self.sortDesc == true ? 'desc' : 'asc';
        else
            sortDirection = self.defaultSortDesc == true ? 'desc' : 'asc';

        let sortingCriteria = createSortingCriteria(sortBy, sortDirection, self.sortByMapping);
        let pagingCriteria = { PageLength: self.pageSize, PageIndex: self.currentPage - 1 };
        let searchCriteria = this.buildSearchCriteria(sortingCriteria, pagingCriteria);

        let searchCallback = function (searchResult) {
            let items = [];
            self.itemCount = searchResult.TotalItemCount;
            let resultData = searchResult.ResultData;
            let i = 0;
            for (i = 0; i < resultData.length; i++) {
                let editorVM = self.createEditorVM();
                editorVM.originalData = resultData[i];
                editorVM.isNewCreate = false;
                editorVM.parentVM = self;
                self.initialLoadItem(editorVM);
                editorVM.loadOriginal(resultData[i]);
                items.push(editorVM);
            }
            self.isBusy = false;
            self.items = items;
            //self.searchFinish();       
        }

        self.searchData(searchCriteria, searchCallback);
    }

    search() {
        if(!this.checkValidate())
            return;
        this.uncheckValidate();
        this.poke(() => this.currentPage = 1);
        this.searchInternal();

    }

    rowSelectChange(items) {
        this.selectedItems = items;
    }

    clearCriteria() {
        
    }

    createEditorVM() {
        throw new NotImplementedError();
    }

    initialAddItem(editorVM) {

    }
    initialLoadItem(editorVM) {

    }

    addItem() {
        let editorVM = this.createEditorVM();
        editorVM.parentVM = this;
        editorVM.isEditing = this.isEditing;
        this.initialAddItem(editorVM);
        this.items.push(editorVM);
        this.afterAdd(editorVM);
    }

    afterAdd(editorVM) {

    }

    removeItems(items) {
        let i = 0;
        for (i = 0; i < items.length; i++) {
            items[i].remove();
        }
        this.search();
    }

    removeItem(item) {
        item.remove();
        this.search();
    }

    cancelAdd(item) {
        this.items.remove(item);
    }

    checkValidate() {
        this.isCheckValidate = true;
        let result = true;
        this.validationFields.forEach(item => {
            result = result && this[item].isValid;
        });
        return result;
    }

    uncheckValidate() {
        this.isCheckValidate = false;
    }
}