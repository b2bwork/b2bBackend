import {IMAGE_URL} from './config';

export function listImage(listImage){
    console.log(listImage);
    let list = [];
    
    for(i=0;listImage.length;i++){
        list.push(listImage[i].filename);
    }
    
    return list;

}