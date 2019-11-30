interface Case<L extends number> extends Array<any>{
    0: any;
    length: L;
}
interface Props<L extends number> extends Array<Array<any>>{
    0: Array<any>;
    length: L;
}

type Mixer<L extends number> = (...values: Case<L>) => any;

class Can<L extends number>{
    props: Props<L>;
    constructor(...props: Props<L>){
        this.props = props;
    }
    get sizes(){
        var sizes = this.props.map(x => 1);
        var size = 1;
        this.props.forEach((x, i) => {
            size *= x.length;
            sizes[i] = size;
        });
        return sizes;
    }
    get size(){
        return this.sizes[this.sizes.length - 1];
    }
    *[Symbol.iterator](){
        for(var i=0;i<this.size;i++){
            yield this.props.map( (x, j) =>  x[~~(i/ ( j==0 ? 1 : this.sizes[j-1] ) ) % x.length] );
        }
    }
    forEach(f: (...param) => void){
        for(var x of this){
            f(x);
        }
    }
    mix(f: Mixer<L>){
        var out = [];
        this.forEach( x => out.push( f(...x) ) );
        return out;
    }
}

var pos = new Can(["0", "1"], ["A", "B", "C"]);
console.log(pos.sizes);
console.log(pos.mix((n, a) => n+a))
