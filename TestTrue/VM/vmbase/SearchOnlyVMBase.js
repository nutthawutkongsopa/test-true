import ViewModelBase from './ViewModelBase.js'
import { NotImplementedError } from '../../asset/js/Errors.js'
export default class SearchOnlyVMBase
    extends ViewModelBase {

    constructor() {
        super();
        this.prepareDefaultSorting.call(this.data);
        this.data.defaultSortBy = this.data.sortBy;
        this.data.defaultSortDesc = this.data.sortDesc;
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
        { value: -1, text: 'All' },
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
    }

    defineComputed(computed) {
        super.defineComputed(computed);
        //computed.dataTable = this.getDataTable
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
        methods.pageChange = this.pageChange;
        methods.rowSelectChange = this.rowSelectChange;
        methods.poke = function (action) {
            this.isPoke = true;
            action();
            this.isPoke = false;
        }
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
            self.isBusy = false;
            self.items = searchResult.ResultData;
            self.itemCount = searchResult.TotalItemCount;
        }
        self.searchData(searchCriteria, searchCallback);
    }

    rowSelectChange(items) {
        this.selectedItems = items;
    }

    search() {
        this.poke(() => this.currentPage = 1);
        this.searchInternal();

    }

    clearCriteria() {
        throw new NotImplementedError();
    }

    createEditorVM() {
        throw new NotImplementedError();
    }
}