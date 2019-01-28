class Feedback {
    constructor(source, container = '#feedbacks', form = '#myform'){
        this.source = source;
        this.container = container;
        this.form = form;
        this.comments = []; // Все отзывы
        this.curID = 0;
        this._init();
    }
    _init(){
        fetch(this.source)
            .then(result => result.json())
            .then(data => {
                this.curID = data.maxID;
                for (let comment of data.comments){
                    this.comments.push(comment);
                    this._renderComment(comment);
                }
                this._initForm();
            })
    }
    _initForm(){
        $(this.form).submit(e => {
            e.preventDefault();
            // $('.all-comments-wrapper').slideDown();
            if(!$('#author').val() && !$('#text').val()){
                return
            }
            let comment = {
                id: ++this.curID,
                author: $('#author').val(),
                text: $('#text').val(),
                approved: false
            };
            $('#author').val('');
            $('#text').val('')
            
            this.comments.push(comment);
            this._renderComment(comment);
        })
    }
    _renderComment(comment){
        let $wrapper = $('<div/>', {
            class: 'comment',
            'data-id': comment.id
        });
        let $author = $(`<div class="author">${comment.author}</div>`);
        let $text = $(`<div class="text">${comment.text}</div>`);
        let $btnWrap = $(`<div class="btn-wrapper"></div>`);
        let $delBtn = $(`<button class="fb-btn">delete</button>`);
        $wrapper.append($author);
        $wrapper.append($text);
        $wrapper.append($btnWrap);
        $btnWrap.append($delBtn);
        $delBtn.click(() => {
            this._remove(comment.id)
        });
        if(!comment.approved){
            let $approve = $(`<button class="approve-btn">approve</button>`);
            $btnWrap.append($approve);
            $approve.click(() => {
                this._approve(comment.id)
            });
        } else {
            $wrapper.addClass('approved');
        }
        $(this.form).before($wrapper);
    }
    
    _remove(id){
        let find = this.comments.find(comment => comment.id === id);
        this.comments.splice(this.comments.indexOf(find), 1);
        $(`.comment[data-id="${id}"]`).fadeOut(1000);
        // if (this.comments.length === 0) {
        //     $('.all-comments-wrapper').slideUp(1000);
        // }
    }
    _approve(id){
        let find = this.comments.find(comment => comment.id === id);
        $(`.comment[data-id="${id}"]`)
            .addClass('approved')
            .find('.approve-btn')
            .fadeOut(1000);
        find.approved = true;
    }
}