d3.csv("books_for_hackathon.csv", function(d){
    console.log(d);
    if (d.Title === "") {
        console.log("skipping")
        return}
    return {
    title: d.Title,
    authors: d.Authors,
    date: d.Date,
    num_translations: d['Number of Translations'],


}}).then(res => console.log(res))
