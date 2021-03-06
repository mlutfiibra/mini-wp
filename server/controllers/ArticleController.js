const Article = require('../models/article')

class ArticleController {
    static findAll(req, res) {
        Article.find()
        .populate('author', 'name')
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(500).json({msg: 'Internal server error'})
        })
    }

    static findAllByOwner(req, res) {
        Article.find({author:req.headers.id})
        .populate('author', 'name')
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(500).json({msg: 'Internal server error'})
        })
    }

    static findOne(req, res) {
        Article.findById(req.params.id)
        .then(articles => {
            res.status(200).json(articles)
        })
        .catch(err => {
            res.status(500).json({msg: 'Internal server error'})
        })
    }

    static create(req, res) {
        const { title, content, tags } = req.body        
        const featured_image = req.file.cloudStoragePublicUrl

        let author = req.headers.id

        let parseTags = []
        if(tags.length>0) {
            JSON.parse(tags).forEach(e=> {
                parseTags.push(e)
            })

        }

        Article.create({
            title,
            content,
            featured_image,
            tags: parseTags,
            author
        })
        .then(article => {
            res.status(200).json(article)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({msg: err})
        })
    }

    static update(req,res) {
        let obj = {}
        for(let key in req.body) {
            if(key==='tags') {
                obj.tags=[]
                JSON.parse(req.body[key]).forEach(e=> {
                    obj.tags.push(e)
                })
            }else {
                obj[key] = req.body[key]
            }
        }


        if(req.file) {
            obj.featured_image=req.file.cloudStoragePublicUrl
        }
        
        
        Article.findOneAndUpdate({_id: req.params.id}, obj, {new:true})
        .then(article => {
            res.status(200).json(article)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        Article.findByIdAndDelete({_id: req.params.id})
        .then(deletedArticle => {
            res.status(200).json(deletedArticle)
        })
        .catch(err => {
            res.status(500).json({msg: err})
        })
    }
}

module.exports = ArticleController
