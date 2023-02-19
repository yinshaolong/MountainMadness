function parse_num_trans(string){
    if (isNaN(string)) {
        let num_as_strs = string.match(/([0-9]*(,[0-9]+)*)/g);
        let already_found_match = false;
        let first_num = null;
        num_as_strs.filter((str) => {
            if( str !== "" & !already_found_match) {
                already_found_match = true;
                str.replaceAll(",", "") 
                console.log(str)
                first_num = parseInt(str)
            }
        })
        console.log("hi", first_num);
        return first_num;
    } else {
        return parseInt(string);
    }
}

d3.csv("books_for_hackathon.csv", function(d){
    return {
    title: d.Title,
    authors: d.Authors,
    date: d.Date,
    num_translations: parse_num_trans(d['Number of Translations']),
    original_langauge: d['Original Language']
}}).then(res => console.log(res))
