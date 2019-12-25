import { Can, Roller, Case, Pair } from "../src/froll"

var roll: Roller = n => {
    var temp = [];
    for(var i=0;i<n;i++){
        temp.push(i+1);
    }
    return temp;
};
var pos = new Can(roll(6), roll(6), roll(6));
console.log(pos.sizes);
var mixed = pos.mix(c => {
    var position = {x: 0, y: 0};
    c.forEach(r => {
        if(r<3){
           position.x++;
        }
        if(r==3){
            position.y++;
        }
    });
    return position;
});
console.log(mixed);
//console.log(mixed.unmix((m) => [m[0], m[1]] as Case<2>));

var mixer = (c: Case<2>) => c[0] + "" + c[1];
var unmixer = (m: string) => [m[0], m[1]] as Case<2>
var a: Pair<Case<2>, string> = [mixer, unmixer];