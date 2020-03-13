module.exports = function({articleRepo}){
    return{

        createArticle: function(article, callback){
            articleRepo.createArticle(article, callback)
        },

        getAllArticles: function(callback){
            articleRepo.getAllArticles(callback)
        },
        getArticleById: function(id, callback){
            articleRepo.getArticleById(id, callback)
        }

    }
}