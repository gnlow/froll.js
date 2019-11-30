interface Case<L extends number> extends Array<any>{
    length: L;
}
interface Props<L extends number> extends Array<Array<any>>{
    length: L;
}

type Mixer<L extends number> = (values: Case<L>) => any;
type Unmixer<L extends number> = (mixedValue: any) => Case<L>;

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
            yield this.props.map( (x, j) =>  x[~~(i/ ( j==0 ? 1 : this.sizes[j-1] ) ) % x.length] ) as Case<L>;
        }
    }
    forEach(f: (param: Case<L>) => void){
        for(var x of this){
            f(x);
        }
    }
    mix(f: Mixer<L>){
        var out: Props<1> = [[]] as Props<1>;
        this.forEach( x => {
            out[0].push( f(x) );
        } );
        return new Can(...out);
    }
    unmix(f: Unmixer<L>){
        var out: Props<L> = [] as Props<L>;
        this.props[0].forEach( x => {
            f(x).forEach( (y, i) => {
                if(out.length - 1 < i){
                    out.push([]);
                }
                out[i].push(y);
             } ) ;
        } );
        return new Can(...out);
    }
}

var pos = new Can([1,2,3,4,5,6], [1,2,3,4,5,6]);
console.log(pos.sizes);
var mixed = pos.mix((c) => c[0] + "" + c[1]);
console.log(mixed.unmix((m) => [m[0], m[1]]));
