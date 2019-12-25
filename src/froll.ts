export interface Case<L extends number> extends Array<any>{
    length: L;
}
export interface Possibles extends Array<any>{

}
export interface Props<L extends number> extends Array<Possibles>{
    length: L;
}

export type Pair<I, O> = [ (input: I) => O, (input: O) => I ];
export type Roller = (...options: any[]) => Possibles;
export type Mixer<L extends number> = (values: Case<L>) => any;
export type Unmixer<L extends number> = (mixedValue: any) => Case<L>;

export class Can<L extends number>{
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
        var out: Possibles = [] as Possibles;
        this.forEach( x => {
            out.push( f(x) );
        } );
        return new Can(out);
    }
    unmix<_L extends number>(f: Unmixer<_L>){
        var out: Props<_L> = [] as Props<_L>;
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