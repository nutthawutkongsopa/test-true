export default class ViewModelBase{
    constructor(){
        this.methods = {};
        this.watch = {};
        this.computed = {};
        this.created = this.created;
        this.mounted = this.mounted;
        this.data = {};
        this.defineData.call(this,this.data);
        this.defineMethods.call(this,this.methods);
        this.defineWatch.call(this,this.watch);
        this.defineComputed.call(this,this.computed);
    }

    created(){

    }

    mounted(){

    }

    defineData(data){

    }

    defineMethods(methods){

    }

    defineWatch(watch){

    }

    defineComputed(computed){

    }
}