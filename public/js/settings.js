for (let i = 1; i < 4; i++) {
    if($("#old-type" + i).val() === 'Number' ){
        $("#exer-type" + i).val('Number');
    }else{
        $("#exer-type" + i).val('Seconds');
    }
    
}

